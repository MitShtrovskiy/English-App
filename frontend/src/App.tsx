import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import WordListPage from './pages/WordListPage'
import EditWordPage from './pages/EditWordPage'
import UploadPage from './pages/UploadPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './ProtectedRoute'            // ✅ защищённые маршруты
import AuthRedirectGuard from './components/AuthRedirectGuard'        // ✅ защита для login/register

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background pb-20">
        <Routes>
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
            path="/login"
            element={
              <AuthRedirectGuard>
                <LoginPage />
              </AuthRedirectGuard>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRedirectGuard>
                <RegisterPage />
              </AuthRedirectGuard>
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
        </Routes>
      </div>
    </Router>
  )
}
