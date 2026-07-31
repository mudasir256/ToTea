import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu as MenuIcon, ShoppingCart, User, X } from "lucide-react";
import { NavLink } from "./NavLink";
import logo from "@/assets/logo.png";
import { useCart } from "@/features/cart/CartProvider";
import { useAuth } from "@/features/auth/AuthProvider";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        // width-before-scroll-bar: Radix dialogs hide the page scrollbar, which widens the
        // viewport this fixed bar measures against and shifts its centered content.
        className="width-before-scroll-bar fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 lg:px-8"
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-[1.75rem] bg-primary px-4 py-3 text-primary-foreground transition-shadow duration-500 ${
            isScrolled ? "shadow-elevated" : "shadow-soft"
          }`}
        >
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-110">
                <img src={logo} alt="Totea Logo" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-accent animate-pulse" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight">Totea</span>
              <span className="text-[10px] uppercase tracking-[0.2em] -mt-1 text-primary-foreground/60">
                Bubble Tea & More
              </span>
            </div>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1 rounded-full bg-primary-foreground/10 p-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
                activeClassName="bg-accent !text-white"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <NavLink
              to="/cart"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingCart size={18} />
              {itemCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              ) : null}
            </NavLink>
            <NavLink
              to={user ? "/account/profile" : "/login"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
              aria-label={user ? "Account" : "Sign in"}
            >
              <User size={18} />
            </NavLink>
            <NavLink
              to="/order"
              className="btn-accent inline-flex items-center gap-2 !rounded-full !px-6 !py-3"
            >
              <span>Order Now</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </NavLink>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <NavLink
              to="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingCart size={18} />
              {itemCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              ) : null}
            </NavLink>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-24 z-40 px-4 sm:px-6 md:hidden"
          >
            <div className="rounded-[1.75rem] bg-primary p-4 text-primary-foreground shadow-elevated">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.label}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-medium text-lg py-3 px-4 rounded-2xl hover:bg-primary-foreground/10 transition-colors"
                    activeClassName="bg-accent !text-white"
                  >
                    {link.label}
                  </NavLink>
                ))}
                <NavLink
                  to={user ? "/account/profile" : "/login"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-medium text-lg py-3 px-4 rounded-2xl hover:bg-primary-foreground/10 transition-colors"
                >
                  {user ? "Account" : "Sign in"}
                </NavLink>
                <NavLink
                  to="/order"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-accent !rounded-full text-center mt-2"
                >
                  Order Now
                </NavLink>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
