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
import WishlistPage from './pages/WishlistPage'
import AccountPage from './pages/AccountPage'
import ListsPage from './pages/ListsPage'
import OffersPage from './pages/OffersPage'
import StoresPage from './pages/StoresPage'
import HelpPage from './pages/HelpPage'
import AboutPage from './pages/AboutPage'
import TrackingPage from './pages/TrackingPage'
import CreditPage from './pages/CreditPage'
import InspirationPage from './pages/InspirationPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      {/* Checkout fuera del Layout: experiencia guiada sin distracciones */}
      <Route path="checkout" element={<CheckoutPage />} />
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="categoria/:slug" element={<CategoryPage />} />
        <Route path="producto/:id" element={<ProductPage />} />
        <Route path="buscar" element={<SearchPage />} />
        <Route path="carro" element={<CartPage />} />
        <Route path="empresas" element={<B2BPortalPage />} />
        <Route path="empresas/credito" element={<CreditPage />} />
        <Route path="cotizacion" element={<QuotePage />} />
        <Route path="ofertas" element={<OffersPage />} />
        <Route path="inspiracion" element={<InspirationPage />} />
        <Route path="tiendas" element={<StoresPage />} />
        <Route path="ayuda" element={<HelpPage />} />
        <Route path="nosotros" element={<AboutPage />} />
        <Route path="seguimiento" element={<TrackingPage />} />
        <Route path="ingresar" element={<LoginPage />} />
        <Route path="mis-pedidos" element={<OrdersPage />} />
        <Route path="favoritos" element={<WishlistPage />} />
        <Route path="cuenta" element={<AccountPage />} />
        <Route path="listas" element={<ListsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
