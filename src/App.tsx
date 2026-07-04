import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './views/HomePage'
import CategoryPage from './views/CategoryPage'
import ProductPage from './views/ProductPage'
import CartPage from './views/CartPage'
import CheckoutPage from './views/CheckoutPage'
import B2BPortalPage from './views/B2BPortalPage'
import QuotePage from './views/QuotePage'
import LoginPage from './views/LoginPage'
import OrdersPage from './views/OrdersPage'
import SearchPage from './views/SearchPage'
import WishlistPage from './views/WishlistPage'
import AccountPage from './views/AccountPage'
import ListsPage from './views/ListsPage'
import OffersPage from './views/OffersPage'
import StoresPage from './views/StoresPage'
import HelpPage from './views/HelpPage'
import AboutPage from './views/AboutPage'
import TrackingPage from './views/TrackingPage'
import CreditPage from './views/CreditPage'
import InspirationPage from './views/InspirationPage'
import CategoriesPage from './views/CategoriesPage'
import EnTiendaPage from './views/EnTiendaPage'
import ContactPage from './views/ContactPage'
import ServicesPage from './views/ServicesPage'
import GiftCardsPage from './views/GiftCardsPage'
import CareersPage from './views/CareersPage'
import LegalPage from './views/LegalPage'
import NotFoundPage from './views/NotFoundPage'

export default function App() {
  return (
    <Routes>
      {/* Carro y checkout fuera del Layout: foco en comprar, sin distracciones */}
      <Route path="carro" element={<CartPage />} />
      <Route path="checkout" element={<CheckoutPage />} />

      {/* El CMS admin vive en el repo `cms-front` (conectado directo a
          cms-service). Este front público solo consume contenido publicado
          vía web-bff-service. Ver docs/CONTRATOS-BFF.md §9. */}
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="categorias" element={<CategoriesPage />} />
        <Route path="en-tienda" element={<EnTiendaPage />} />
        <Route path="categoria/:slug" element={<CategoryPage />} />
        <Route path="producto/:id" element={<ProductPage />} />
        <Route path="buscar" element={<SearchPage />} />
        <Route path="empresas" element={<B2BPortalPage />} />
        <Route path="empresas/credito" element={<CreditPage />} />
        <Route path="cotizacion" element={<QuotePage />} />
        <Route path="ofertas" element={<OffersPage />} />
        <Route path="inspiracion" element={<InspirationPage />} />
        <Route path="tiendas" element={<StoresPage />} />
        <Route path="servicios" element={<ServicesPage />} />
        <Route path="ayuda" element={<HelpPage />} />
        <Route path="contacto" element={<ContactPage />} />
        <Route path="gift-cards" element={<GiftCardsPage />} />
        <Route path="trabaja-con-nosotros" element={<CareersPage />} />
        <Route path="legal" element={<LegalPage />} />
        <Route path="legal/:doc" element={<LegalPage />} />
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
