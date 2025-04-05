import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { AnimatePresence } from 'framer-motion'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTranslation, setShowTranslation] = useState(false)
  const [currentLang, setCurrentLang] = useState<'en' | 'ru'>('en')

  const fetchWords = () => {
    api.get('/words').then((res) => setWords(res.data))
  }

  useEffect(() => {
    fetchWords()
  }, [])

  const handleNext = () => {
    setShowTranslation(false)
    setCurrentLang('en')
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  const handlePrev = () => {
    setShowTranslation(false)
    setCurrentLang('en')
    setCurrentIndex((prev) =>
      prev - 1 < 0 ? words.length - 1 : prev - 1
    )
  }

  const markAsLearned = () => {
    const currentWord = words[currentIndex]
    api.patch(`/words/${currentWord.id}`, { learned: true }).then(fetchWords)
  }

  const visibleWords = words.filter((w) => !w.learned)
  const currentWord = visibleWords[currentIndex % visibleWords.length]

  if (!currentWord) return null

  return (
    <div className="p-6 space-y-6 max-w-[430px] mx-auto min-h-[90vh] flex flex-col justify-between">
      <AnimatePresence mode="wait">
        <WordCard
          key={currentWord.id + currentLang + showTranslation}
          word={currentWord}
          currentLang={currentLang}
          showTranslation={showTranslation}
          onToggleLanguage={() =>
            setCurrentLang((prev) => (prev === 'en' ? 'ru' : 'en'))
          }
          onToggleTranslation={() => setShowTranslation((prev) => !prev)}
          onMarkAsLearned={markAsLearned}
        />
      </AnimatePresence>

      <div className="flex justify-between gap-4">
        <button
          onClick={handlePrev}
          className="flex flex-col justify-center items-center gap-2 w-[176px] h-[64px] bg-white/20 rounded-2xl text-white text-sm"
        >
          Назад
        </button>
        <button
          onClick={handleNext}
          className="flex flex-col justify-center items-center gap-2 w-[176px] h-[64px] bg-white/20 rounded-2xl text-white text-sm"
        >
          Вперёд
        </button>
      </div>
    </div>
  )
}