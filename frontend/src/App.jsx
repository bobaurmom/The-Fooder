import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { CartProvider } from './context/CartContext'
import { FavoritesProvider } from './context/FavoritesContext'
import ProtectedRoute from './auth/ProtectedRoute'
import PhoneFrame from './components/PhoneFrame'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Filter from './pages/Filter'
import FoodInfo from './pages/FoodInfo'
import Cart from './pages/Cart'
import Payment from './pages/Payment'
import Favorites from './pages/Favorites'
import EditProfile from './pages/EditProfile'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <PhoneFrame>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/filter" element={<Filter />} />
                <Route path="/food/:id" element={<FoodInfo />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/favorites" element={<Favorites />} />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/profile/edit"
                  element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Home />} />

                {/* Unknown paths fall back to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </PhoneFrame>
          </BrowserRouter>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  )
}
