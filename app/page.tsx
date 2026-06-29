import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import OneStep from "@/components/OneStep";
import StoreBuilder from "@/components/StoreBuilder";
import NetworkMap from "@/components/NetworkMap";
import Dashboard from "@/components/Dashboard";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <OneStep />
        <StoreBuilder />
        <NetworkMap />
        <Dashboard />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
