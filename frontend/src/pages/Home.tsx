import { useEffect, useState } from 'react'
import WordCard from '../components/WordCard'
import { api } from '../utils/api'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [isEnglish, setIsEnglish] = useState(true)
  const [showTranslation, setShowTranslation] = useState(false)

  useEffect(() => {
    api.get('/words').then((res) => {
      setWords(res.data.filter((w: any) => !w.learned))
    })
  }, [])

  const nextCard = () => {
    setCurrent((prev) => (prev + 1) % words.length)
    setIsEnglish(true)
    setShowTranslation(false)
  }

  const prevCard = () => {
    setCurrent((prev) => (prev - 1 + words.length) % words.length)
    setIsEnglish(true)
    setShowTranslation(false)
  }

  const handleMarkAsLearned = (id: number) => {
    api.patch(`/words/${id}`, { learned: true }).then(() => {
      setWords((prev) => prev.filter((w) => w.id !== id))
      setCurrent((prev) => (prev >= words.length - 1 ? 0 : prev))
    })
  }

  const word = words[current]

  return (
    <div className="flex flex-col min-h-screen w-full max-w-[430px] mx-auto px-4 pb-8 pt-[72px] relative overflow-hidden">
      {word ? (
        <>
          <div className="flex-1 flex items-start">
            <WordCard
              word={word}
              isEnglish={isEnglish}
              showTranslation={showTranslation}
              onToggleLanguage={() => setIsEnglish((prev) => !prev)}
              onToggleTranslation={() => setShowTranslation((prev) => !prev)}
              onMarkAsLearned={() => handleMarkAsLearned(word.id)}
            />
          </div>

          {/* 🔽 Навигация */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={prevCard}
              className="flex flex-col justify-center items-center gap-2 flex-1 h-16 rounded-[20px] bg-white/10"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="text-sm text-white">Назад</span>
            </button>
            <button
              onClick={nextCard}
              className="flex flex-col justify-center items-center gap-2 flex-1 h-16 rounded-[20px] bg-white/10"
            >
              <ChevronRight className="w-6 h-6" />
              <span className="text-sm text-white">Вперёд</span>
            </button>
          </div>
        </>
      ) : (
        <div className="text-center text-white text-lg mt-20">🎉 Все слова выучены!</div>
      )}
    </div>
  )
}