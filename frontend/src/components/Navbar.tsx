import { useNavigate } from 'react-router-dom'
import { List, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-14 px-4 flex items-center justify-between bg-zinc-900/70 backdrop-blur-md border-b border-zinc-800 max-w-[430px] mx-auto">
      {/* ✅ изменён путь на /list */}
      <Button variant="ghost" size="icon" onClick={() => navigate('/list')}>
        <List className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => alert('Загрузка новых слов')}>
        <Download className="w-5 h-5" />
      </Button>
    </div>
  )
}