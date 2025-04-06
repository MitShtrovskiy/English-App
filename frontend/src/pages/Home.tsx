import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import WordCard from '../components/WordCard'
import { api } from '../utils/api'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  // Получаем список слов с бэка
  const fetchWords = async () => {
    const res = await api.get('/words')
    setWords(res.data)
  }

  useEffect(() => {
    fetchWords()
  }, [])

  const handleNext = () => {
    setDirection('right')
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  const handlePrev = () => {
    setDirection('left')
    setCurrentIndex((prev) =>
      prev === 0 ? words.length - 1 : prev - 1
    )
  }

  const currentWord = words[currentIndex]

  return (
    <div className="relative flex flex-col items-center w-full max-w-[440px] mx-auto h-[100dvh] bg-black overflow-hidden">
      {/* Навбар со счётчиком и прогресс-баром */}
      <Navbar
        totalCount={words.length}
        learnedCount={words.filter((word) => word.learned).length}
      />

      {/* Область карточки */}
      <div className="flex flex-col items-start w-full h-full px-0 pt-[54px]">
        <div className="flex-1 w-full relative overflow-hidden">
          <AnimatePresence mode="wait">
            {currentWord && (
              <motion.div
                key={currentWord.id}
                initial={{ x: direction === 'right' ? 300 : -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction === 'right' ? -300 : 300, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute top-0 left-0 w-full h-full px-0"
              >
                <WordCard word={currentWord} onRefresh={fetchWords} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Кнопки навигации */}
        <div className="flex justify-center items-center gap-2 px-10 pb-14 pt-6 w-full">
          <button
            onClick={handlePrev}
            className="flex h-[64px] flex-col justify-center items-center gap-[10px] flex-[1_0_0] rounded-[20px] bg-white/10 text-white text-sm"
          >
            Назад
          </button>
          <button
            onClick={handleNext}
            className="flex h-[64px] flex-col justify-center items-center gap-[10px] flex-[1_0_0] rounded-[20px] bg-white/10 text-white text-sm"
          >
            Вперёд
          </button>
        </div>
      </div>
    </div>
  )
}