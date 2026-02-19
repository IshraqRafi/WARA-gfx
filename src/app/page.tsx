import MainLayout from "@/components/layout/MainLayout";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Reviews from "@/components/sections/Reviews";
import Founders from "@/components/sections/Founders";
import Stats from "@/components/sections/Stats";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <Projects />
      <Reviews />
      <Founders />
      <Stats />
      <Contact />
    </MainLayout>
  );
}
