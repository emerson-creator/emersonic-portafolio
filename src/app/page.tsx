import Hero from "@/components/sections/Hero";
import Domains from "@/components/sections/Domains";
import Projects from "@/components/sections/Projects";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />

      <Projects />
      <Domains />
      <About />
      <Contact />
    </main>
  );
}
