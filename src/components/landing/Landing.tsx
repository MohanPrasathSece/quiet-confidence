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

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
      <Nav />
      <main>
        <Hero />
        <Metrics />
        <ProductOverview />
        <FeatureStack />
        <Ecosystem />
        <ProductDemo />
        <Security />
        <Testimonials />
        <Integrations />
        <FinalStatement />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}