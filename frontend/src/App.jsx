import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import BookingPage from './pages/BookingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MyBookingsPage from './pages/MyBookingsPage'
import ProfilePage from './pages/ProfilePage'
import PartnerPage from './pages/PartnerPage'
import NotFoundPage from './pages/NotFoundPage'

function Layout({ children }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh' }}>{children}</main>
      <Footer />
    </>
  )
}

function AuthLayout({ children }) {
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
            <Route path="/services/:id" element={<Layout><ServiceDetailPage /></Layout>} />
            <Route path="/book/:id" element={<Layout><BookingPage /></Layout>} />
            <Route path="/my-bookings" element={<Layout><MyBookingsPage /></Layout>} />
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/partner" element={<Layout><PartnerPage /></Layout>} />
            <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
            <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
            <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
