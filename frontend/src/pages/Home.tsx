import { useEffect, useState } from 'react'
import WordCard from '../components/WordCard'
import { api } from '../utils/api'
import { AnimatePresence } from 'framer-motion'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  const fetchWords = async () => {
    const res = await api.get('/words')
    setWords(res.data)
  }

  useEffect(() => {
    fetchWords()
  }, [])

  const filteredWords = words.filter((w) => !w.learned)

  const handleNext = () => {
    setDirection('next')
    setCurrentIndex((prev) => (prev + 1) % filteredWords.length)
  }

  const handlePrev = () => {
    setDirection('prev')
    setCurrentIndex((prev) =>
      (prev - 1 + filteredWords.length) % filteredWords.length
    )
  }

  const handleLearned = async () => {
    const currentWord = filteredWords[currentIndex]
    if (currentWord) {
      await api.patch(`/words/${currentWord.id}`, { learned: true })
      fetchWords()
    }
  }

  const currentWord = filteredWords[currentIndex]

  return (
    <div className="relative flex flex-col items-center w-full max-w-[440px] mx-auto h-[100dvh] bg-black overflow-hidden">
      <div className="flex-1 w-full">
        <AnimatePresence mode="wait">
          {currentWord && (
            <WordCard
              key={currentWord.id}
              word={currentWord}
              onMarkAsLearned={handleLearned}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Кнопки вперёд/назад */}
      <div className="flex items-center justify-between gap-2 w-full px-10 pb-14 pt-4">
        <button
          onClick={handlePrev}
          className="flex h-16 flex-col justify-center items-center gap-2 flex-1 rounded-[20px] bg-white/10 text-white text-base"
        >
          Назад
        </button>
        <button
          onClick={handleNext}
          className="flex h-16 flex-col justify-center items-center gap-2 flex-1 rounded-[20px] bg-white/10 text-white text-base"
        >
          Вперёд
        </button>
      </div>
    </div>
  )
}