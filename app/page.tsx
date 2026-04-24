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
          key={`${s.title}-${i}`}
          service={s}
          index={i + 1}
          total={services.length}
        />
      )),
      // When two panels share a title (e.g. the A.I Automations animated /
      // static comparison pair), disambiguate the dot-nav aria-label.
      labels: services.map((s, i) => {
        const duplicate = services.filter((x) => x.title === s.title).length > 1;
        return duplicate ? `${s.title} (${i + 1})` : s.title;
      }),
    },
    { type: "vertical", content: <Industries />, label: "Industries" },
    { type: "vertical", content: <Blog />, label: "Blog" },
    { type: "dock", content: <Footer />, label: "Footer" },
  ];

  return <FullPageScroller slides={slides} />;
}
