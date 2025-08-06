import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Importa tus componentes de páginas
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
//Importo el contexto
import { AuthProvider } from './contexts/AuthContext'
const App = () => {
  return (
    <Router>
      <div className="app">
        <AuthProvider>
          <Navbar />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
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
        </AuthProvider>
      </div>
    </Router>
  )
}

export default App
