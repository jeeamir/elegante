import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import ProfileSetupPage from './pages/ProfileSetupPage'
import AppShell from './pages/AppShell'
import OutfitPage from './pages/OutfitPage'
import FeedbackPage from './pages/FeedbackPage'
import WardrobePage from './pages/WardrobePage'
import HistoryPage from './pages/HistoryPage'

function ProtectedRoute({ children }) {
  const { isAuth } = useAuth()
  return isAuth ? children : <Navigate to="/auth" replace />
}

function AuthRedirect() {
  const { isAuth } = useAuth()
  return isAuth ? <Navigate to="/app" replace /> : <AuthPage />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthRedirect />} />
          <Route
            path="/setup"
            element={
              <ProtectedRoute>
                <ProfileSetupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<OutfitPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="wardrobe" element={<WardrobePage />} />
            <Route path="history" element={<HistoryPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
