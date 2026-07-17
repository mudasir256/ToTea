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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "glass py-3 shadow-lg border-b border-border/50"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-110">
                <img src={logo} alt="Totea Logo" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-accent animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
                Totea
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground -mt-1">
                Bubble Tea & More
              </span>
            </div>
          </NavLink>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                className="relative font-medium text-foreground/80 hover:text-foreground transition-colors duration-300 group"
                activeClassName="text-foreground"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <NavLink
              to="/cart"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
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
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
              aria-label={user ? "Account" : "Sign in"}
            >
              <User size={18} />
            </NavLink>
            <NavLink to="/order" className="btn-accent inline-flex items-center gap-2 !px-6 !py-3">
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
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground"
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
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-secondary text-foreground"
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
            className="fixed inset-x-0 top-20 z-40 p-6 md:hidden"
          >
            <div className="glass rounded-3xl p-6 shadow-elevated">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.label}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-medium text-lg text-foreground py-3 px-4 rounded-xl hover:bg-secondary transition-colors"
                  >
                    {link.label}
                  </NavLink>
                ))}
                <NavLink
                  to={user ? "/account/profile" : "/login"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-medium text-lg text-foreground py-3 px-4 rounded-xl hover:bg-secondary transition-colors"
                >
                  {user ? "Account" : "Sign in"}
                </NavLink>
                <NavLink
                  to="/order"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-accent text-center mt-4"
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
