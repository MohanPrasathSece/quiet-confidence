import { useState } from "react";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Metrics } from "./Metrics";
import { ProductOverview } from "./ProductOverview";
import { FeatureStack } from "./FeatureStack";
import { Ecosystem } from "./Ecosystem";
import { ProductDemo } from "./ProductDemo";
import { Security } from "./Security";
import { Testimonials } from "./Testimonials";
import { Integrations } from "./Integrations";
import { FinalStatement } from "./FinalStatement";
import { CTA } from "./CTA";
import { Footer } from "./Footer";
import { AuthModal } from "./AuthModal";

export default function Landing() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const openAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
      <Nav onSignIn={() => openAuth("signin")} onSignUp={() => openAuth("signup")} />
      <main>
        <Hero onPrimary={() => openAuth("signup")} />
        <Metrics />
        <ProductOverview />
        <FeatureStack />
        <Ecosystem />
        <ProductDemo />
        <Security />
        <Testimonials />
        <Integrations />
        <FinalStatement />
        <CTA onPrimary={() => openAuth("signup")} />
      </main>
      <Footer />
      <AuthModal open={authOpen} initialMode={authMode} onClose={() => setAuthOpen(false)} />
    </div>
  );
}