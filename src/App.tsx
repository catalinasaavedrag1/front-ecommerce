import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import B2BPortalPage from './pages/B2BPortalPage'
import QuotePage from './pages/QuotePage'
import LoginPage from './pages/LoginPage'
import OrdersPage from './pages/OrdersPage'
import SearchPage from './pages/SearchPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="categoria/:slug" element={<CategoryPage />} />
        <Route path="producto/:id" element={<ProductPage />} />
        <Route path="buscar" element={<SearchPage />} />
        <Route path="carro" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="empresas" element={<B2BPortalPage />} />
        <Route path="cotizacion" element={<QuotePage />} />
        <Route path="ingresar" element={<LoginPage />} />
        <Route path="mis-pedidos" element={<OrdersPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
