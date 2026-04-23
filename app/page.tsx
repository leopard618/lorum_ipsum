import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import Intro from "@/components/Intro";
import Services from "@/components/Services";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Intro />
      <Services />
      <Blog />
      <Footer />
    </main>
  );
}
