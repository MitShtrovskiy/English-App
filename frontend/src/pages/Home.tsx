import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { AnimatePresence, motion } from 'framer-motion'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isEnglish, setIsEnglish] = useState(true)
  const [hideTranslation, setHideTranslation] = useState(true)

  useEffect(() => {
    api.get('/words').then((res) => setWords(res.data))
  }, [])

  const currentWord = words[currentIndex]

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length)
    setHideTranslation(true)
    setIsEnglish(true)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length)
    setHideTranslation(true)
    setIsEnglish(true)
  }

  const handleMarkAsLearned = () => {
    api.patch(`/words/${currentWord.id}`, { learned: true }).then(() => {
      const newWords = words.filter((w: any) => w.id !== currentWord.id)
      setWords(newWords)
      setCurrentIndex((prev) => (prev >= newWords.length ? 0 : prev))
    })
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 h-[100dvh] max-w-[430px] mx-auto">
      <div className="flex-1 w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentWord && (
            <motion.div
              key={currentWord.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <WordCard
                word={currentWord}
                isEnglish={isEnglish}
                hideTranslation={hideTranslation}
                onToggleLanguage={() => setIsEnglish((v) => !v)}
                onToggleTranslation={() => setHideTranslation((v) => !v)}
                onMarkAsLearned={handleMarkAsLearned}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {words.length > 0 && (
        <div className="flex gap-4 mt-8 w-full justify-between px-1">
          <button
            onClick={handlePrev}
            className="flex flex-col justify-center items-center gap-2 w-[176px] h-[64px] bg-white/10 rounded-[20px] text-white text-base"
          >
            Назад
          </button>
          <button
            onClick={handleNext}
            className="flex flex-col justify-center items-center gap-2 w-[176px] h-[64px] bg-white/10 rounded-[20px] text-white text-base"
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  )
}