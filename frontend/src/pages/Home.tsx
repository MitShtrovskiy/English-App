import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    api.get('/words').then((res) => setWords(res.data))
  }, [])

  const nextWord = () => {
    setIndex((prev) => (prev + 1) % words.length)
  }

  const prevWord = () => {
    setIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  const currentWord = words[index]

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background px-4 pt-4 pb-4 max-w-[430px] mx-auto overflow-hidden">
      {/* Верхний навбар */}
      <header className="flex justify-between items-center h-16 mb-4">
        <Button variant="ghost" size="icon">
          📋
        </Button>
        <Button variant="ghost" size="icon">
          ⬆️
        </Button>
      </header>

      {/* Контент карточки */}
      {currentWord && (
        <div className="flex-1 flex items-start justify-center">
          <WordCard word={currentWord} />
        </div>
      )}

      {/* Навигация */}
      <div className="flex justify-between gap-4 mt-4">
        <Button
          onClick={prevWord}
          className="flex h-16 flex-col justify-center items-center gap-2 flex-1 rounded-[20px] bg-white/10 text-white"
        >
          <ChevronLeft />
          Назад
        </Button>
        <Button
          onClick={nextWord}
          className="flex h-16 flex-col justify-center items-center gap-2 flex-1 rounded-[20px] bg-white/10 text-white"
        >
          <ChevronRight />
          Вперёд
        </Button>
      </div>
    </div>
  )
}