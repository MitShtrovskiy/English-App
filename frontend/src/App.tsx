import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import WordListPage from './pages/WordListPage'
import EditWordPage from './pages/EditWordPage'
import UploadPage from './pages/UploadPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<WordListPage />} /> {/* ✅ путь */}
          <Route path="/edit/new" element={<EditWordPage />} /> 
          <Route path="/words/:id/edit" element={<EditWordPage />} />
          <Route path="/words" element={<WordListPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  )
}