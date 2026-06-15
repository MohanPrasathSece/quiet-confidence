import { createFileRoute } from "@tanstack/react-router";
import Landing from "@/components/landing/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vault — Crypto Infrastructure For The Next Generation" },
      {
        name: "description",
        content:
          "Secure, scalable and intelligent crypto infrastructure built for modern finance.",
      },
      { property: "og:title", content: "Vault — Crypto Infrastructure" },
      {
        property: "og:description",
        content:
          "Secure, scalable and intelligent crypto infrastructure built for modern finance.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <Landing />;
}
