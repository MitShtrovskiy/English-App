import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { AnimatePresence, motion } from 'framer-motion'
import Controls from '../components/Controls'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchWords = () => {
    setIsLoading(true)
    api.get('/words')
      .then((res) => {
        setWords(res.data)
        setCurrentIndex(0)
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchWords()
  }, [])

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      (prev - 1 + words.length) % words.length
    )
  }

  const handleNext = () => {
    setCurrentIndex((prev) =>
      (prev + 1) % words.length
    )
  }

  const unlearnedWords = words.filter((word) => !word.learned)
  const currentWord = unlearnedWords[currentIndex]

  return (
    <div className="relative flex flex-col justify-between items-center min-h-screen max-w-[430px] mx-auto px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] overflow-hidden">
      {isLoading ? (
        <div className="text-white mt-20">Загрузка...</div>
      ) : unlearnedWords.length === 0 ? (
        <div className="text-white mt-20 text-center text-xl">🎉 Все слова выучены!</div>
      ) : (
        <>
          <div className="flex-1 w-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentWord.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <WordCard word={currentWord} onRefresh={fetchWords} />
              </motion.div>
            </AnimatePresence>
          </div>

          <Controls onPrev={handlePrev} onNext={handleNext} />
        </>
      )}
    </div>
  )
}