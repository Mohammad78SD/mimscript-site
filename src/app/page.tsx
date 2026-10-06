import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { Services } from "@/components/Services";
import { ClientSection } from "@/components/ClientSection";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <Services />
      <ClientSection />
      <About />
      <Contact />
    </>
  );
}
