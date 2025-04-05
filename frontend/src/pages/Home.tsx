import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [index, setIndex] = useState(0)

  const fetchWords = async () => {
    const res = await api.get('/words')
    const sorted = res.data.sort((a, b) => a.id - b.id)
    setWords(sorted)
  }

  useEffect(() => {
    fetchWords()
  }, [])

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % words.length)
  }

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  const currentWord = words[index]

  return (
    <div className="flex flex-col justify-between h-[calc(100dvh-64px)] max-w-[430px] mx-auto px-4 pt-6 pb-4 overflow-hidden">
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentWord && (
            <motion.div
              key={currentWord.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <WordCard word={currentWord} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-6">
        <Button
          onClick={handlePrev}
          className="flex flex-col justify-center items-center h-16 flex-1 rounded-[20px] bg-white/10 text-white text-base"
        >
          ← Назад
        </Button>
        <Button
          onClick={handleNext}
          className="flex flex-col justify-center items-center h-16 flex-1 rounded-[20px] bg-white/10 text-white text-base"
        >
          Вперёд →
        </Button>
      </div>
    </div>
  )
}