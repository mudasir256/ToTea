import { Link } from "react-router-dom";

const MAPS_PLACE_URL =
  "https://www.google.com/maps/place/Totea/@38.7506653,-77.4506,17z/data=!3m1!4b1!4m6!3m5!1s0x89b65b0036266e09:0xb1aa00c6a78ebc0d!8m2!3d38.7506653!4d-77.4506!16s%2Fg%2F11yyn9rth_!18m1!1e1?entry=ttu";

/** Official Google Maps embed for the Totea Manassas place pin. */
const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3105.5!2d-77.4506!3d38.7506653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b65b0036266e09%3A0xb1aa00c6a78ebc0d!2sTotea!5e0!3m2!1sen!2sus!4v1720000000000!5m2!1sen!2sus";

interface LocationsProps {
  hideHeader?: boolean;
}

export const Locations = ({ hideHeader = false }: LocationsProps) => {
  return (
    <section className="mx-auto max-w-[1100px]">
      {!hideHeader ? null : (
        <div className="px-5 pb-2 pt-10 md:px-8 md:pb-2 md:pt-[60px]">
          <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-hover">
            Visit us
          </div>
          <h1 className="mb-2 font-serif text-[30px] font-semibold text-foreground md:text-[32px]">
            Find us in Manassas
          </h1>
          <p className="max-w-[480px] text-[14px] leading-[1.6] text-muted-foreground">
            One location, brewing fresh every day. Stop in, or order ahead and skip the
            line.
          </p>
        </div>
      )}

      <div className="mx-5 mt-6 overflow-hidden rounded-2xl border border-border md:mx-8 md:mt-10 md:grid md:grid-cols-2">
        <div className="relative min-h-[280px] overflow-hidden bg-[#e8e0d4] md:min-h-[380px]">
          <iframe
            title="Totea Manassas map"
            src={MAP_EMBED}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="origin"
            allowFullScreen
          />
        </div>

        <div className="px-6 py-8 md:px-10 md:py-11">
          <div className="mb-1.5 font-serif text-[22px] font-semibold text-foreground">
            Totea — Manassas
          </div>
          <div className="mb-5 text-[14.5px] leading-[1.6] text-foreground/85">
            9534 Liberia Ave
            <br />
            Manassas, VA 20110
          </div>

          <div className="border-t border-border py-3.5">
            <div className="mb-1 text-[12px] uppercase tracking-[0.04em] text-muted-foreground">
              Hours
            </div>
            <div className="text-[14px] text-foreground">Mon–Thu · 11:00 AM – 9:00 PM</div>
            <div className="text-[14px] text-foreground">Fri–Sat · 11:00 AM – 10:00 PM</div>
            <div className="text-[14px] text-foreground">Sun · 12:00 PM – 8:00 PM</div>
          </div>

          <div className="border-t border-border py-3.5">
            <div className="mb-1 text-[12px] uppercase tracking-[0.04em] text-muted-foreground">
              Phone
            </div>
            <div className="text-[14px] text-foreground">
              (placeholder — add shop number)
            </div>
          </div>

          <div className="border-t border-border py-3.5">
            <div className="mb-1 text-[12px] uppercase tracking-[0.04em] text-muted-foreground">
              Parking
            </div>
            <div className="text-[14px] text-foreground">On-site parking available</div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link
              to="/menu"
              className="inline-block rounded-full bg-accent px-[22px] py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-hover active:bg-accent-active"
            >
              Order now
            </Link>
            <a
              href={MAPS_PLACE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border border-foreground px-[22px] py-3 text-[13.5px] font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Get directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
