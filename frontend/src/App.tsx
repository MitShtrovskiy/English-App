import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dictionary from './pages/Dictionary'
import WordDetail from './pages/WordDetail'
import { Navbar } from './components/Navbar'
import Upload from './pages/Upload'
import WordListPage from './pages/WordListPage'


export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/dictionary/:id" element={<WordDetail />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/list" element={<WordListPage />} />
          <Route path="/edit/:id" element={<EditWordPage />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  )
}