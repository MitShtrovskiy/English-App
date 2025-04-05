// src/components/Navbar.tsx
import { useNavigate } from 'react-router-dom'
import { List, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-14 px-4 flex items-center justify-between bg-zinc-900/70 backdrop-blur-md border-b border-zinc-800 max-w-[430px] mx-auto">
      <Button variant="ghost" size="icon" onClick={() => navigate('/word-list')}>
        <List className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => alert('Загрузка новых слов')}>
        <Download className="w-5 h-5" />
      </Button>
    </div>
  )
}
export const Navbar = () => {
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <button className="text-lg">Список слов</button>
      <button className="text-lg">Загрузить новые слова</button>
    </div>
  )
}