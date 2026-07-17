import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/features/cart/CartProvider";
import { CartItemRow } from "@/features/cart/components/CartItemRow";
import { CartSummary } from "@/features/cart/components/CartSummary";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CartPage() {
  const {
    items,
    loading,
    subtotalCents,
    shippingCents,
    discountCents,
    taxCents,
    totalCents,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="section-padding pt-28 md:pt-36">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="heading-lg">Your cart</h1>
              <p className="mt-2 text-muted-foreground">Review your drinks before checkout.</p>
            </div>
            {items.length > 0 ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="rounded-2xl">
                    Clear cart
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This removes every item from your cart. You can add them again from the menu.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => void clearCart()}>Clear cart</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}
          </div>

          {loading ? (
            <LoadingSpinner label="Loading cart..." />
          ) : items.length === 0 ? (
            <EmptyState
              title="Your cart is empty"
              description="Browse the menu and add your favorite drinks."
              action={
                <Button asChild className="btn-accent">
                  <Link to="/menu">Continue shopping</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQuantity={(id, qty) => void updateQuantity(id, qty)}
                    onRemove={(id) => void removeItem(id)}
                  />
                ))}
                <Button asChild variant="outline" className="rounded-2xl">
                  <Link to="/menu">Continue shopping</Link>
                </Button>
              </div>
              <CartSummary
                subtotalCents={subtotalCents}
                shippingCents={shippingCents}
                discountCents={discountCents}
                taxCents={taxCents}
                totalCents={totalCents}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
