import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import WordListPage from './pages/WordListPage'
import EditWordPage from './pages/EditWordPage'
import UploadPage from './pages/UploadPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import { AuthProvider, useAuth } from './AuthContext'
import ProtectedRoute from './ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background pb-20">
          <Routes>
            {/* 🔐 Защищённые маршруты */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/list"
              element={
                <ProtectedRoute>
                  <WordListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/new"
              element={
                <ProtectedRoute>
                  <EditWordPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/words/:id/edit"
              element={
                <ProtectedRoute>
                  <EditWordPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/words"
              element={
                <ProtectedRoute>
                  <WordListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* 👤 Доступные маршруты для неавторизованных */}
            <Route path="/login" element={<AuthRedirectGuard component={<LoginPage />} />} />
            <Route path="/register" element={<AuthRedirectGuard component={<RegisterPage />} />} />

            {/* 🛑 Редирект на домашнюю */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}
