import { useState } from "react";
import { ScrollLink } from "@/components/ScrollLink";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/about" },
  { label: "Order Now", href: "/menu" },
  { label: "Locations", href: "/locations" },
];

export const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
    alert("Thank you for joining!");
  };

  return (
    <footer className="mt-[60px] border-t border-border px-5 pt-14 md:px-8 md:pt-14">
      <div className="mx-auto max-w-[1100px]">
        <div className="grid gap-10 border-b border-border pb-11 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.1fr] lg:gap-10">
          <div className="md:col-span-2 lg:col-span-1">
            <div className="mb-1.5 font-serif text-[23px] font-semibold text-foreground">
              Totea
            </div>
            <p className="max-w-[260px] text-[12.5px] leading-[1.7] text-muted-foreground">
              A cup worth slowing down for. Manassas, VA.
            </p>
          </div>

          <div>
            <div className="mb-4 text-[12px] font-bold uppercase tracking-[0.06em] text-accent-hover">
              Explore
            </div>
            {exploreLinks.map((link) => (
              <ScrollLink
                key={link.label}
                to={link.href}
                className="mb-3 block text-[13px] text-foreground/80 transition-opacity hover:opacity-100"
              >
                {link.label}
              </ScrollLink>
            ))}
          </div>

          <div>
            <div className="mb-4 text-[12px] font-bold uppercase tracking-[0.06em] text-accent-hover">
              Visit
            </div>
            <ScrollLink
              to="/locations"
              className="mb-3 block text-[13px] leading-relaxed text-foreground/80"
            >
              9534 Liberia Ave
              <br />
              Manassas, VA 20110
            </ScrollLink>
            <ScrollLink
              to="/contact"
              className="mb-3 block text-[13px] text-foreground/80"
            >
              Contact us
            </ScrollLink>
            <ScrollLink
              to="/locations"
              className="mb-3 block text-[13px] leading-relaxed text-foreground/80"
            >
              Mon–Thu 11–9
              <br />
              Fri–Sat 11–10 · Sun 12–8
            </ScrollLink>
          </div>

          <div>
            <div className="mb-4 text-[12px] font-bold uppercase tracking-[0.06em] text-accent-hover">
              Get $2 off your first order
            </div>
            <p className="mb-3.5 text-[12.5px] leading-[1.6] text-muted-foreground">
              Join for early access to seasonal drinks and local promos — texted or
              emailed, your choice.
            </p>
            <form onSubmit={handleSubmit} className="mb-2.5 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                required
                className="min-w-0 flex-1 rounded-md border border-border bg-white px-3 py-2.5 text-[12.5px] text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-md bg-accent px-4 text-[12.5px] font-semibold text-white transition-colors hover:bg-accent-hover active:bg-accent-active"
              >
                Join
              </button>
            </form>
            <p className="text-[10.5px] leading-[1.5] text-muted-foreground">
              By joining, you agree to receive promotional messages. Reply STOP to
              unsubscribe anytime.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-2.5 py-5 text-[11.5px] text-muted-foreground sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Totea. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
