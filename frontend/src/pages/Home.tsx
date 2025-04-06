// src/pages/Home.tsx
import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import '../styles/wordCardStyles.css'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api.get('/words').then((res) => {
      setWords(res.data)
      setIsLoading(false)
    })
  }, [])

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-lg">
        Загрузка...
      </div>
    )
  }

  const currentWord = words[currentIndex]

  return (
    <div className="relative max-w-[430px] mx-auto flex flex-col items-center justify-between h-screen overflow-hidden">
      {/* Карточка */}
      <div className="flex-grow flex items-center justify-center px-4 pt-[60px] pb-[110px] w-full">
        <WordCard word={currentWord} />
      </div>

      {/* Кнопки навигации */}
      <div className="flex justify-between w-full px-4 pb-6 gap-3 z-10">
        <Button className="nav-button" onClick={prevCard}>
          <ArrowLeft className="mr-2" />
          Назад
        </Button>
        <Button className="nav-button" onClick={nextCard}>
          Вперед
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  )
}