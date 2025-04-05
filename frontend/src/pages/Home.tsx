import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { AnimatePresence, motion } from 'framer-motion'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    api.get('/words').then((res) => {
      const unlearnedWords = res.data.filter((w: any) => !w.learned)
      setWords(unlearnedWords)
      setCurrentIndex(0)
    })
  }, [])

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  const currentWord = words[currentIndex]

  return (
    <div className="min-h-screen w-full px-4 pt-10 pb-28 flex flex-col items-center justify-between max-w-[430px] mx-auto overflow-hidden">
      {/* Карточка */}
      <div className="w-full flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord?.id}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {currentWord && <WordCard word={currentWord} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Навигация */}
      <div className="mt-6 flex justify-between gap-4 w-full">
        <button
          onClick={goPrev}
          className="flex flex-col justify-center items-center p-0 gap-2 w-[176px] h-16 bg-white/10 rounded-[20px] text-white"
        >
          Назад
        </button>

        <button
          onClick={goNext}
          className="flex flex-col justify-center items-center p-0 gap-2 w-[176px] h-16 bg-white/10 rounded-[20px] text-white"
        >
          Вперёд
        </button>
      </div>
    </div>
  )
}