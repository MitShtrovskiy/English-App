import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchWords = async () => {
    setIsLoading(true)
    try {
      const res = await api.get('/words')
      const filtered = res.data.filter((word: any) => !word.learned)
      setWords(filtered)
    } catch (error) {
      console.error('Error loading words:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWords()
  }, [])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  const currentWord = words[currentIndex]

  return (
    <div className="relative flex flex-col items-center justify-between h-[100dvh] overflow-hidden px-4 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
      {/* 👇 Навигационная панель */}
      <div className="flex justify-between w-full max-w-[430px] pt-4 pb-2 z-10">
        <Button onClick={() => (window.location.href = '/word-list')} variant="ghost" size="icon">
          📚
        </Button>
        <Button onClick={() => (window.location.href = '/upload')} variant="ghost" size="icon">
          ⬆️
        </Button>
      </div>

      {/* 👇 Контент карточки */}
      <div className="flex flex-1 items-center justify-center w-full max-w-[430px] relative">
        <AnimatePresence mode="wait">
          {!isLoading && currentWord ? (
            <motion.div
              key={currentWord.id}
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <WordCard word={currentWord} onRefresh={fetchWords} />
            </motion.div>
          ) : (
            <div className="text-muted-foreground text-center">🙌 Все слова выучены!</div>
          )}
        </AnimatePresence>
      </div>

      {/* 👇 Кнопки навигации */}
      {!isLoading && words.length > 1 && (
        <div className="flex justify-between gap-4 mt-4 w-full max-w-[430px] z-10">
          <Button
            onClick={handlePrev}
            className="flex flex-col justify-center items-center gap-2 h-16 flex-1 bg-white/10 rounded-2xl"
          >
            <ChevronLeft />
            Назад
          </Button>
          <Button
            onClick={handleNext}
            className="flex flex-col justify-center items-center gap-2 h-16 flex-1 bg-white/10 rounded-2xl"
          >
            <ChevronRight />
            Вперёд
          </Button>
        </div>
      )}
    </div>
  )
}