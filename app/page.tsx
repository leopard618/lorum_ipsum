import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import Intro from "@/components/Intro";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Intro />

      {/* Services — placeholder */}
      <section className="h-24" />

      {/* Industries we serve — placeholder */}
      <section className="h-24" />

      <Blog />
      <Footer />
    </main>
  );
}
