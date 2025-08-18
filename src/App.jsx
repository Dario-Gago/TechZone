import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

// Importa tus componentes de páginas
import Inicio from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import PagoExitoso from './pages/PaymentSuccess'
import Dashboard from './pages/Dashboard'
import ProductDetail from './pages/ProductDetail'
import CategoryPage from './pages/CategoryPage'
import SearchPage from './pages/SearchPage'
import RutaPrivada from './components/PrivateRoute'
import RutaPublica from './components/PublicRoute'
import Contact from './pages/Contact'

//Importo el contexto
import { ProveedorAutenticacion } from './contexts/AuthContext'
import { ProveedorProducto } from './contexts/ProductContext'
import { ProveedorCarrito } from './contexts/CartContext'
import { SalesProvider } from './contexts/SalesContext'

const App = () => {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="min-h-screen flex flex-col bg-gray-50">
        <ProveedorAutenticacion>
          <ProveedorProducto>
            <ProveedorCarrito>
              <SalesProvider>
                <ScrollToTop>
                  <Navbar />

                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Inicio />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route
                        path="/category/:categorySlug"
                        element={<CategoryPage />}
                      />
                      <Route path="/search" element={<SearchPage />} />
                      <Route
                        path="/login"
                        element={
                          <RutaPublica>
                            <Login />
                          </RutaPublica>
                        }
                      />

                      <Route
                        path="/register"
                        element={
                          <RutaPublica>
                            <Register />
                          </RutaPublica>
                        }
                      />

                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route
                        path="/payment-success"
                        element={<PagoExitoso />}
                      />
                      <Route
                        path="/dashboard"
                        element={
                          <RutaPrivada>
                            <Dashboard />
                          </RutaPrivada>
                        }
                      />
                      <Route path="/contact" element={<Contact />} />
                    </Routes>
                  </main>
                  <Footer />
                </ScrollToTop>
              </SalesProvider>
            </ProveedorCarrito>
          </ProveedorProducto>
        </ProveedorAutenticacion>
      </div>
    </Router>
  )
}

export default App
