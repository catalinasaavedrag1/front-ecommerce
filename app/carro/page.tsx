import { Suspense } from 'react'
import CartPage from '@/views/CartPage'

export const metadata = { robots: { index: false, follow: true } }

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CartPage />
    </Suspense>
  )
}
