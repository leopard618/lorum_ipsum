import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import FullPageScroller, { type Slide } from "@/components/FullPageScroller";
import Industries from "@/components/Industries";
import Intro from "@/components/Intro";
import ServicePanel, { services } from "@/components/ServicePanel";

export default function Home() {
  const slides: Slide[] = [
    { type: "vertical", content: <Intro />, label: "Intro" },
    {
      type: "horizontal",
      panels: services.map((s, i) => (
        <ServicePanel
          key={s.title}
          service={s}
          index={i + 1}
          total={services.length}
        />
      )),
      labels: services.map((s) => s.title),
    },
    { type: "vertical", content: <Industries />, label: "Industries" },
    { type: "vertical", content: <Blog />, label: "Blog" },
    { type: "dock", content: <Footer />, label: "Footer" },
  ];

  return <FullPageScroller slides={slides} />;
}
