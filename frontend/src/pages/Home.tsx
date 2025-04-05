import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { Button } from '@/components/ui/button'
import { AnimatePresence } from 'framer-motion'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  const fetchWords = () => {
    api.get('/words').then((res) => setWords(res.data))
  }

  useEffect(() => {
    fetchWords()
  }, [])

  const next = () => {
    setDirection('next')
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  const prev = () => {
    setDirection('prev')
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  const currentWord = words[currentIndex]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-[430px] mx-auto space-y-6 overflow-hidden">
      <div className="relative w-full min-h-[250px] flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {currentWord && (
            <WordCard key={currentWord.id} word={currentWord} direction={direction} />
          )}
        </AnimatePresence>
      </div>
      <div className="flex space-x-4">
        <Button onClick={prev}>← Назад</Button>
        <Button onClick={next}>Вперёд →</Button>
      </div>
    </div>
  )
}