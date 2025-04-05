import { Link } from 'react-router-dom'
import { BookOpen, Home, Upload } from 'lucide-react'

export const Navbar = () => (
  <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white py-3 px-6 flex justify-between">
    <Link to="/"><Home /></Link>
    <Link to="/dictionary"><BookOpen /></Link>
    <Link to="/upload"><Upload /></Link>
  </nav>
)
