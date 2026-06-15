import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import fs from "fs";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    {
      name: "vercel-serverless-local",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith("/api/auth/")) {
            // Load .env variables on every request to pick up user edits dynamically
            const envPath = path.resolve(process.cwd(), ".env");
            if (fs.existsSync(envPath)) {
              const envContent = fs.readFileSync(envPath, "utf-8");
              envContent.split("\n").forEach((line) => {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith("#")) {
                  const parts = trimmed.split("=");
                  const key = parts[0].trim();
                  const val = parts.slice(1).join("=").trim();
                  if (key) {
                    const cleanVal = val.replace(/^["']|["']$/g, "");
                    process.env[key] = cleanVal;
                  }
                }
              });
            }

            const pathname = req.url.split("?")[0];
            const relativePath = pathname.replace(/^\//, ""); // api/auth/signup
            
            const filePaths = [
              path.resolve(process.cwd(), relativePath + ".ts"),
              path.resolve(process.cwd(), relativePath + ".js"),
              path.resolve(process.cwd(), relativePath, "index.ts"),
              path.resolve(process.cwd(), relativePath, "index.js"),
            ];
            
            let matchedPath = "";
            for (const fp of filePaths) {
              if (fs.existsSync(fp)) {
                matchedPath = fp;
                break;
              }
            }
            
            if (matchedPath) {
              try {
                // Use Vite SSR system to transpile and run TypeScript serverless code locally
                const module = await server.ssrLoadModule(matchedPath);
                const handler = module.default;
                
                if (typeof handler === "function") {
                  const vercelReq = req as any;
                  
                  // Parse POST body
                  if (req.method === "POST" || req.method === "PUT") {
                    const buffers: any[] = [];
                    for await (const chunk of req) {
                      buffers.push(chunk);
                    }
                    const bodyText = Buffer.concat(buffers).toString();
                    try {
                      vercelReq.body = JSON.parse(bodyText);
                    } catch {
                      vercelReq.body = bodyText;
                    }
                  }
                  
                  const vercelRes = res as any;
                  vercelRes.status = (code: number) => {
                    res.statusCode = code;
                    return vercelRes;
                  };
                  
                  vercelRes.json = (data: any) => {
                    if (!res.headersSent) {
                      res.setHeader("Content-Type", "application/json");
                    }
                    res.end(JSON.stringify(data));
                    return vercelRes;
                  };
                  
                  vercelRes.send = (data: any) => {
                    res.end(data);
                    return vercelRes;
                  };
                  
                  const originalSetHeader = res.setHeader.bind(res);
                  vercelRes.setHeader = (name: string, value: string) => {
                    originalSetHeader(name, value);
                    return vercelRes;
                  };
                  
                  await handler(vercelReq, vercelRes);
                  return;
                }
              } catch (err: any) {
                console.error(`[Serverless Dev] Error running handler for ${req.url}:`, err);
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Internal dev server error", details: err.message }));
                return;
              }
            }
          }
          next();
        });
      }
    }
  ],
});
