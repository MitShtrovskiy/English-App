import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dictionary from './pages/Dictionary'
import WordDetail from './pages/WordDetail'
import { Navbar } from './components/Navbar'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/dictionary/:id" element={<WordDetail />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  )
}
