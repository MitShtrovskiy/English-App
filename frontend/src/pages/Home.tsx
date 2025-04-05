import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, UploadCloud, List } from 'lucide-react'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    api.get('/words').then((res) => setWords(res.data))
  }, [])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  const currentWord = words[currentIndex]

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Навбар */}
      <div className="flex justify-between items-center px-4 py-4">
        <Button variant="ghost" size="icon">
          <List className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <UploadCloud className="w-5 h-5" />
        </Button>
      </div>

      {/* Карточка */}
      <div className="flex-1 flex justify-center items-center overflow-hidden px-4 pb-4">
        {currentWord && <WordCard word={currentWord} />}
      </div>

      {/* Навигация */}
      <div className="flex gap-4 px-4 pb-6">
        <Button
          onClick={handlePrev}
          className="flex flex-col justify-center items-center gap-2 flex-1 h-16 rounded-[20px] bg-white/10"
        >
          <ChevronLeft className="w-5 h-5" />
          Назад
        </Button>
        <Button
          onClick={handleNext}
          className="flex flex-col justify-center items-center gap-2 flex-1 h-16 rounded-[20px] bg-white/10"
        >
          <ChevronRight className="w-5 h-5" />
          Вперёд
        </Button>
      </div>
    </div>
  )
}