import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import { useAuthStore } from './stores/authStore.js'
import './App.css'
import './styles/manager-status.css'

export default function App() {
  const { initialize, initialized, needsSetup } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (!initialized) return <div className="loading-screen" role="status">Loading portal…</div>

  return (
    <Routes>
      <Route path="/signup" element={needsSetup ? <SignupPage /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={needsSetup ? <Navigate to="/signup" replace /> : <LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
