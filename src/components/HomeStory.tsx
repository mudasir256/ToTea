import { Link } from "react-router-dom";
import matchaCup from "@/assets/matcha_totea_cup.jpg";
import vietnameseCoffee from "@/assets/VietnameseSeaSaltCoffee.png";
import brownSugarMilk from "@/assets/BrownSugarMilkTea.webp";

const sections = [
  {
    id: "01",
    eyebrow: "The coffee",
    heading: "Brewed one cup at a time, the Vietnamese way",
    body: "Our beans are bought direct from growers in Vietnam. Every cup is dripped slowly through a phin filter — no shortcuts, no machines rushing it — for a bold, smooth cup you won't get from a powder mix.",
    anchor: "/about#phin",
    reverse: false,
    media: {
      src: vietnameseCoffee,
      alt: "Vietnamese phin coffee in a Totea cup",
    },
  },
  {
    id: "02",
    eyebrow: "The matcha",
    heading: "Picked once a year, whisked fresh every time",
    body: "We import our matcha from Japan's first spring harvest — the leaves prized for their sweetness and color. It's whisked cup by cup, never pre-mixed or held in a jug.",
    anchor: "/about#matcha",
    reverse: true,
    media: {
      src: matchaCup,
      alt: "Iced matcha latte in a Totea cup",
    },
  },
  {
    id: "03",
    eyebrow: "The sweetness",
    heading: "Cane, pressed fresh every morning",
    body: "No syrup, no concentrate. We press whole sugarcane stalks fresh each day, so the sweetness in your drink is real — and you can actually taste the difference.",
    anchor: "/about#cane",
    reverse: false,
    media: {
      src: brownSugarMilk,
      alt: "Brown sugar milk tea sweetened the Totea way",
    },
  },
];

function JourneyLink({
  to,
  children,
  light = false,
}: {
  to: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.04em] ${
        light ? "text-background" : "text-foreground"
      }`}
    >
      <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-accent text-white">
        →
      </span>
      {children}
    </Link>
  );
}

export const HomeStory = () => {
  return (
    <>
      {sections.map((section) => (
        <section
          key={section.id}
          className={`mx-auto grid max-w-[1100px] items-center gap-10 px-5 py-16 md:grid-cols-[0.9fr_1.1fr] md:gap-[50px] md:px-8 md:py-[90px] ${
            section.reverse ? "md:grid-cols-[1.1fr_0.9fr]" : ""
          }`}
        >
          <div className={section.reverse ? "md:order-1" : ""}>
            <div className="mb-1.5 font-serif text-[64px] font-semibold leading-none text-border md:text-[74px]">
              {section.id}
            </div>
            <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-hover">
              {section.eyebrow}
            </div>
            <h2 className="mb-3.5 max-w-md font-serif text-[26px] font-semibold leading-[1.2] text-foreground md:text-[28px]">
              {section.heading}
            </h2>
            <p className="mb-5 max-w-[420px] text-[14.5px] leading-[1.75] text-foreground/85">
              {section.body}
            </p>
            <JourneyLink to={section.anchor}>Our journey</JourneyLink>
          </div>

          <div
            className={`relative aspect-[4/5] overflow-hidden rounded-[14px] bg-[#4a2f18] ${
              section.reverse ? "md:order-2" : ""
            }`}
          >
            <img
              src={section.media.src}
              alt={section.media.alt}
              className="h-full w-full object-cover"
            />
          </div>
        </section>
      ))}

      <div className="mx-auto max-w-[1100px] px-4 md:px-8">
        <div className="rounded-2xl bg-foreground px-8 py-[50px] text-center text-background md:px-10 md:py-[60px]">
          <h2 className="mb-3 font-serif text-[24px] font-semibold md:text-[26px]">
            There&apos;s more to how we do this
          </h2>
          <p className="mx-auto mb-6 max-w-[440px] text-[13.5px] leading-[1.7] text-background/75">
            From the farms we work with to why we still do things the slow way —
            read the full story behind Totea.
          </p>
          <div className="flex justify-center">
            <JourneyLink to="/about" light>
              Read our full story
            </JourneyLink>
          </div>
        </div>
      </div>
    </>
  );
};
