import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

// Importa tus componentes de páginas
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Dashboard from './pages/Dashboard'
import ProductDetail from './pages/ProductDetail'
import CategoryPage from './pages/CategoryPage'
import SearchPage from './pages/SearchPage'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'

//Importo el contexto
import { AuthProvider } from './contexts/AuthContext'
import { ProductProvider } from './contexts/ProductContext'
import { CartProvider } from './contexts/CartContext'

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <ScrollToTop>
                <Navbar />

                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route
                      path="/category/:categorySlug"
                      element={<CategoryPage />}
                    />
                    <Route path="/search" element={<SearchPage />} />
                    <Route
                      path="/login"
                      element={
                        <PublicRoute>
                          <Login />
                        </PublicRoute>
                      }
                    />

                    <Route
                      path="/register"
                      element={
                        <PublicRoute>
                          <Register />
                        </PublicRoute>
                      }
                    />

                    <Route path="/cart" element={<Cart />} />
                    <Route
                      path="/dashboard"
                      element={
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      }
                    />
                  </Routes>
                </main>
                <Footer />
              </ScrollToTop>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </div>
    </Router>
  )
}

export default App
