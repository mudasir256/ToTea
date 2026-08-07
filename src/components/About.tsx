import { Link } from "react-router-dom";
import matchaCup from "@/assets/matcha_totea_cup.jpg";
import vietnameseCoffee from "@/assets/VietnameseSeaSaltCoffee.png";
import brownSugarMilk from "@/assets/BrownSugarMilkTea.webp";

const deepSections = [
  {
    id: "phin",
    eyebrow: "The coffee",
    heading: "Phin coffee, brewed one cup at a time",
    paragraphs: [
      "Our beans are bought direct from growers in Vietnam — no middleman, no anonymous blend. Every cup is dripped slowly through a phin filter, the traditional way, drop by drop over several minutes.",
      "[Placeholder — add specifics: which region/farm the beans come from, how long you've sourced this way, any detail that makes it yours specifically.]",
    ],
    reverse: false,
    media: {
      src: vietnameseCoffee,
      alt: "Vietnamese phin coffee in a Totea cup",
    },
  },
  {
    id: "matcha",
    eyebrow: "The matcha",
    heading: "Matcha, picked once a year",
    paragraphs: [
      "We import our matcha from Japan's first spring harvest — the leaves prized for their sweetness, color, and the smoothness that only the earliest picking gives you. It's whisked fresh, cup by cup, never pre-mixed or held in a jug.",
      "[Placeholder — add sourcing specifics: the region in Japan, the grade of matcha, or why first-harvest specifically matters to you.]",
    ],
    reverse: true,
    media: {
      src: matchaCup,
      alt: "Iced matcha latte in a Totea cup",
    },
  },
  {
    id: "cane",
    eyebrow: "The sweetness",
    heading: "Sugarcane, pressed fresh every morning",
    paragraphs: [
      "No syrup, no concentrate. We press whole sugarcane stalks fresh each day, so the sweetness in your drink is real — and you can actually taste the difference between that and a bottled syrup.",
      "[Placeholder — add a detail about the press process or where the cane comes from.]",
    ],
    reverse: false,
    media: {
      src: brownSugarMilk,
      alt: "Brown sugar milk tea sweetened the Totea way",
    },
  },
];

interface AboutProps {
  hideHeader?: boolean;
}

export const About = ({ hideHeader = false }: AboutProps) => {
  return (
    <section>
      {!hideHeader ? null : (
        <>
          <div className="mx-auto max-w-[640px] px-5 pb-12 pt-14 text-center md:px-8 md:pb-[50px] md:pt-[70px]">
            <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-hover">
              Our story
            </div>
            <h1 className="mb-4 font-serif text-[32px] font-semibold text-foreground md:text-[36px]">
              Everything, made the slow way
            </h1>
            <p className="text-[14.5px] leading-[1.75] text-muted-foreground">
              [Placeholder — replace with the real founder/origin story: why Totea
              started, who started it, and what brought it to Manassas. 2–4 sentences,
              written in your own voice.]
            </p>
          </div>

        </>
      )}

      <div className="mx-auto max-w-[1100px]">
        {deepSections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            className={`scroll-mt-24 grid items-center gap-10 border-t border-border px-5 py-14 md:grid-cols-[0.9fr_1.1fr] md:gap-[50px] md:px-8 md:py-[70px] ${
              section.reverse ? "md:grid-cols-[1.1fr_0.9fr]" : ""
            }`}
          >
            <div className={section.reverse ? "md:order-1" : ""}>
              <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-hover">
                {section.eyebrow}
              </div>
              <h2 className="mb-3.5 font-serif text-[24px] font-semibold text-foreground md:text-[26px]">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mb-3.5 max-w-[440px] text-[14px] leading-[1.8] text-foreground/85"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div
              className={`relative aspect-[4/5] overflow-hidden rounded-[14px] bg-[#4a2f18] ${
                section.reverse ? "md:order-2" : ""
              }`}
            >
              <img
                src={section.media.src}
                alt={section.media.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ))}

        <div className="mx-4 mt-10 rounded-2xl bg-foreground px-8 py-[50px] text-center text-background md:mx-8">
          <h2 className="mb-3.5 font-serif text-[22px] font-semibold">
            Come taste it for yourself
          </h2>
          <Link
            to="/menu"
            className="inline-block rounded bg-accent px-[22px] py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-hover active:bg-accent-active"
          >
            Order Now
          </Link>
        </div>
      </div>
    </section>
  );
};
