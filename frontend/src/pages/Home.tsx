import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  const fetchWords = () => {
    api.get('/words').then((res) => setWords(res.data))
  }

  useEffect(() => {
    fetchWords()
  }, [])

  const handleNext = () => {
    setDirection('right')
    setIndex((prev) => (prev + 1) % words.length)
  }

  const handlePrev = () => {
    setDirection('left')
    setIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  const variants = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'left' ? -100 : 100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'left' ? 100 : -100,
      opacity: 0,
    }),
  }

  const currentWord = words[index]

  return (
    <div className="max-w-[430px] mx-auto h-[90vh] flex flex-col justify-center items-center px-4 overflow-hidden">
      {words.length > 0 && (
        <>
          <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentWord.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="absolute w-full"
              >
                <WordCard word={currentWord} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Навигация */}
          <div className="flex justify-between w-full mt-6">
            <button
              onClick={handlePrev}
              className="text-muted-foreground hover:text-white transition"
              title="Назад"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="text-muted-foreground hover:text-white transition"
              title="Вперёд"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}