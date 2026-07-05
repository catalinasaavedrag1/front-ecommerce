import { Suspense } from 'react'
import CheckoutPage from '@/views/CheckoutPage'

export const metadata = { robots: { index: false, follow: true } }

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CheckoutPage />
    </Suspense>
  )
}
