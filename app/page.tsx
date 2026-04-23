import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import FullPageScroller, { type Slide } from "@/components/FullPageScroller";
import Intro from "@/components/Intro";
import ServicePanel, { services } from "@/components/ServicePanel";

export default function Home() {
  const slides: Slide[] = [
    { type: "vertical", content: <Intro />, label: "Intro" },
    {
      type: "horizontal",
      panels: services.map((s) => (
        <ServicePanel key={s.title} service={s} />
      )),
      labels: services.map((s) => s.title),
    },
    { type: "vertical", content: <Blog />, label: "Blog" },
    { type: "dock", content: <Footer />, label: "Footer" },
  ];

  return <FullPageScroller slides={slides} />;
}
