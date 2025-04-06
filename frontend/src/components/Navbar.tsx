import { useNavigate } from 'react-router-dom'
import { List, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const navigate = useNavigate()
  
  return (
    <div className="w-full flex items-center justify-between px-4 py-4 bg-black/30 backdrop-blur-sm z-10">
      <button onClick={() => navigate('/words')} className="text-white opacity-80">
        <List className="w-6 h-6" />
      </button>
      <button onClick={() => navigate('/upload')} className="text-white opacity-80">
        <Upload className="w-6 h-6" />
      </button>
    </div>
  )
}