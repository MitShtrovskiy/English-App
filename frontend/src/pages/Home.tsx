import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { AnimatePresence, motion } from 'framer-motion'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchWords = async () => {
    setLoading(true)
    try {
      const res = await api.get('/words')
      setWords(res.data)
    } catch (e) {
      console.error('Ошибка загрузки слов', e)
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Загрузка слов...
      </div>
    )
  }

  const currentWord = words[currentIndex]

  return (
    <div className="relative flex flex-col items-center justify-between px-4 pt-6 pb-28 max-w-[430px] mx-auto min-h-[100svh]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord?.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          <WordCard word={currentWord} />
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-4 mt-6 w-full px-2">
        <button
          onClick={handlePrev}
          className="flex flex-col justify-center items-center gap-2 flex-1 h-16 bg-white/10 rounded-2xl text-white"
        >
          Назад
        </button>
        <button
          onClick={handleNext}
          className="flex flex-col justify-center items-center gap-2 flex-1 h-16 bg-white/10 rounded-2xl text-white"
        >
          Вперед
        </button>
      </div>
    </div>
  )
}