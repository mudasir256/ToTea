import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import Cart from '@/components/Cart'

export const metadata: Metadata = {
  title: 'ToTea - Premium Bubble Tea & Coffee | Northern Virginia',
  description: 'Discover the finest bubble tea, Vietnamese coffee, matcha, and fresh pastries at ToTea. Open daily with late-night hours. Order online for pickup or delivery.',
  keywords: 'bubble tea, boba tea, Vietnamese coffee, matcha, Northern Virginia, tea shop, coffee shop',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
          <Cart />
        </CartProvider>
      </body>
    </html>
  )
}

