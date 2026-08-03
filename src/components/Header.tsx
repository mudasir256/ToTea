import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu as MenuIcon, ShoppingCart, X } from "lucide-react";
import { NavLink } from "./NavLink";
import { useCart } from "@/features/cart/CartProvider";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/about" },
  { label: "Locations", href: "/locations" },
  { label: "Contact", href: "/contact" },
];

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="flex w-full items-center justify-between px-5 py-4 sm:px-8 md:px-10 md:py-[22px] lg:px-14">
          <NavLink to="/" className="group shrink-0">
            <div className="font-serif text-[22px] font-semibold leading-none tracking-tight text-foreground md:text-[23px]">
              Totea
            </div>
            <div className="mt-0.5 text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
              Bubble tea &amp; more
            </div>
          </NavLink>

          <nav className="flex items-center gap-3 md:gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                className="hidden text-[14px] font-medium text-foreground/75 transition-opacity hover:text-foreground md:inline"
                activeClassName="!text-foreground !font-semibold !opacity-100"
              >
                {link.label}
              </NavLink>
            ))}

            <NavLink
              to="/cart"
              className="relative inline-flex h-9 w-9 items-center justify-center text-foreground/70 transition-colors hover:text-foreground"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingCart size={18} strokeWidth={1.75} />
              {itemCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              ) : null}
            </NavLink>

            <NavLink
              to="/menu"
              className="rounded-full bg-accent px-5 py-[10px] text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover active:bg-accent-active md:px-6 md:py-[11px] md:text-[13.5px]"
              activeClassName="bg-accent-hover"
            >
              Order Now
            </NavLink>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="inline-flex h-9 w-9 items-center justify-center text-foreground md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed inset-x-0 top-[73px] z-40 w-full border-b border-border bg-background px-5 py-4 sm:px-8 md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded px-3 py-3 text-[15px] font-medium text-foreground/80"
                  activeClassName="!text-foreground !font-semibold bg-secondary"
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};
