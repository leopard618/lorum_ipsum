import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import Intro from "@/components/Intro";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Intro />
      <Blog />
      <Footer />
    </main>
  );
}
