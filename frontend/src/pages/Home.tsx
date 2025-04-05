import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

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
    <div className="h-[100dvh] pb-24 pt-6 px-4 max-w-[430px] mx-auto flex flex-col justify-between items-stretch overflow-hidden">
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord?.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {currentWord && <WordCard word={currentWord} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between gap-4 mt-6">
        <Button
          onClick={prevWord}
          className="flex flex-col justify-center items-center gap-2 flex-1 h-16 rounded-[20px] bg-white/10"
        >
          Назад
        </Button>
        <Button
          onClick={nextWord}
          className="flex flex-col justify-center items-center gap-2 flex-1 h-16 rounded-[20px] bg-white/10"
        >
          Вперёд
        </Button>
      </div>
    </div>
  )
}