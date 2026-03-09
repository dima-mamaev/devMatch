import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeIntro } from "@/components/home/HomeIntro";
import { HomeHIW } from "@/components/home/HomeHIW";
import { HomeDevFeed } from "@/components/home/HomeDevFeed";
import { HomeAIMatch } from "@/components/home/HomeAIMatch";
import { HomeCTA } from "@/components/home/HomeCTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HomeIntro />
        <HomeHIW />
        <HomeDevFeed />
        <HomeAIMatch />
        <HomeCTA />
      </main>
      <Footer />
    </div>
  );
}
