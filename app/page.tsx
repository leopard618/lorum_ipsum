import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import FullPageScroller, { type Slide } from "@/components/FullPageScroller";
import Industries from "@/components/Industries";
import Intro from "@/components/Intro";
import MenuOverlay, { type MenuItem } from "@/components/MenuOverlay";
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

  // Step indices map to the slide order above:
  //   0 = Intro, 1..3 = Services horizontal panels (we land on the first),
  //   4 = Industries, 5 = Blog, 6 = Footer.
  // The Contact entry routes to a standalone /contact page (white form,
  // hCaptcha, etc.) rather than jumping inside the scroller.
  const menuItems: MenuItem[] = [
    { label: "Home", step: 0, hint: "Welcome" },
    { label: "Services", step: 1, hint: "What we do" },
    { label: "Industries", step: 4, hint: "Where we work" },
    { label: "Blog", step: 5, hint: "Field notes & essays" },
    { label: "Contact", href: "/contact", hint: "Get in touch" },
  ];

  return (
    <FullPageScroller slides={slides}>
      <MenuOverlay items={menuItems} />
    </FullPageScroller>
  );
}
