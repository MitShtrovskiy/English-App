import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { gradients } from '@/utils/gradients'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    api.get('/words').then((res) => setWords(res.data))
  }, [])

  const currentWord = words[currentIndex]
  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  const gradientIndex = currentWord?.id % gradients.length
  const bgGradient = gradients[gradientIndex]

  return (
    <div
      className="relative flex flex-col items-center justify-between w-full min-h-screen text-white overflow-hidden"
      style={{
        background: bgGradient,
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="w-full max-w-[430px] px-4 pt-[70px]">
        <AnimatePresence mode="wait">
          {currentWord && (
            <motion.div
              key={currentWord.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <WordCard word={currentWord} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Контролы вынесены сюда */}
      <div className="flex justify-between items-center gap-4 px-4 pt-6 pb-10 w-full max-w-[430px]">
        <Button
          onClick={goPrev}
          className="flex h-16 flex-col justify-center items-center gap-2 flex-1 rounded-[20px] bg-white/10"
        >
          <ChevronLeft className="h-5 w-5" />
          Назад
        </Button>
        <Button
          onClick={goNext}
          className="flex h-16 flex-col justify-center items-center gap-2 flex-1 rounded-[20px] bg-white/10"
        >
          <ChevronRight className="h-5 w-5" />
          Вперёд
        </Button>
      </div>
    </div>
  )
}