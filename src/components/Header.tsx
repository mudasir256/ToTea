import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu as MenuIcon, Package, ShoppingCart, User, X } from "lucide-react";
import { toast } from "sonner";
import { NavLink } from "./NavLink";
import { useCart } from "@/features/cart/CartProvider";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/about" },
  { label: "Locations", href: "/locations" },
  { label: "Contact", href: "/contact" },
];

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const displayName = profile?.full_name?.trim() || user?.email || "Account";

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out");
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign out");
    }
  };

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

            {!authLoading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground/75 transition-colors hover:border-accent/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Open profile menu"
                  >
                    <User size={18} strokeWidth={1.75} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl border-border bg-background p-1.5 shadow-md">
                  <DropdownMenuLabel className="px-2.5 py-2">
                    <p className="truncate text-[13px] font-semibold text-foreground">{displayName}</p>
                    {user.email ? (
                      <p className="mt-0.5 truncate text-[11px] font-normal text-muted-foreground">
                        {user.email}
                      </p>
                    ) : null}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px]">
                    <Link to="/account/orders">
                      <Package className="mr-2 h-4 w-4" />
                      Order history
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px]">
                    <Link to="/account/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] text-destructive focus:text-destructive"
                    onSelect={() => {
                      void handleSignOut();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !authLoading ? (
              <NavLink
                to="/login"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground/75 transition-colors hover:border-accent/40 hover:text-foreground"
                aria-label="Sign in"
              >
                <User size={18} strokeWidth={1.75} />
              </NavLink>
            ) : (
              <span className="inline-flex h-9 w-9" aria-hidden />
            )}

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
              {user ? (
                <>
                  <NavLink
                    to="/account/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded px-3 py-3 text-[15px] font-medium text-foreground/80"
                    activeClassName="!text-foreground !font-semibold bg-secondary"
                  >
                    Order history
                  </NavLink>
                  <NavLink
                    to="/account/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded px-3 py-3 text-[15px] font-medium text-foreground/80"
                    activeClassName="!text-foreground !font-semibold bg-secondary"
                  >
                    Profile
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      void handleSignOut();
                    }}
                    className="rounded px-3 py-3 text-left text-[15px] font-medium text-destructive"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded px-3 py-3 text-[15px] font-medium text-foreground/80"
                  activeClassName="!text-foreground !font-semibold bg-secondary"
                >
                  Sign in
                </NavLink>
              )}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};
