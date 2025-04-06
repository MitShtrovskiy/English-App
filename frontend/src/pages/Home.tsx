import { useEffect, useState } from 'react'
import WordCard from '../components/WordCard'
import { api } from '../utils/api'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import '../styles/cardStyles.css'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchWords = async () => {
    try {
      setIsLoading(true)
      const res = await api.get('/words')
      setWords(res.data)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWords()
  }, [])

  const unlearnedWords = words.filter((w) => !w.learned)

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % unlearnedWords.length)
  }

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + unlearnedWords.length) % unlearnedWords.length)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-lg">
        Загрузка...
      </div>
    )
  }

  if (unlearnedWords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4 text-white space-y-4">
        <h2 className="text-2xl font-bold">🎉 Все слова выучены!</h2>
        <p className="text-white/70">Вы можете загрузить новые слова или повторить уже изученные.</p>
      </div>
    )
  }

  const currentWord = unlearnedWords[currentIndex]

  return (
    <div className="flex flex-col h-screen pb-safe relative max-w-[430px] mx-auto overflow-hidden">
      {/* Верхняя часть: карточка */}
      <div className="flex-1 flex items-center justify-center px-4">
        <WordCard word={currentWord} />
      </div>

      {/* Нижняя часть: навигация */}
      <div className="flex gap-3 px-4 pb-8 pt-4">
        <Button
          onClick={prevCard}
          className={cn('text-white text-sm font-medium', 'nav-button')}
        >
          Назад
        </Button>
        <Button
          onClick={nextCard}
          className={cn('text-white text-sm font-medium', 'nav-button')}
        >
          Вперёд
        </Button>
      </div>
    </div>
  )
}