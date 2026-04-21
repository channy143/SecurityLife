import { BrowserRouter, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import AppRoutes from './routes/AppRoutes'
import './styles/index.css'

/**
 * Layout - Handles conditional rendering of Navbar/Footer
 * Hides them on login and register pages
 */
const Layout = () => {
  const location = useLocation()
  const hideNavFooter = ['/login', '/register'].includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavFooter && <Navbar />}
      <main className={`flex-grow ${hideNavFooter ? '' : ''}`}>
        <AppRoutes />
      </main>
      {!hideNavFooter && <Footer />}
    </div>
  )
}

/**
 * App - Root component of the application
 * Wraps the entire app with necessary providers and layout components
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
