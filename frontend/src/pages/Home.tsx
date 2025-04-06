import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import Navbar from '../components/Navbar'
import { AnimatePresence } from 'framer-motion'
import { getRandomGradient } from '../utils/gradients'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [index, setIndex] = useState(0)
  const [gradient, setGradient] = useState(getRandomGradient())

  // Загружаем слова
  useEffect(() => {
    api.get('/words').then((res) => setWords(res.data))
  }, [])

  const filteredWords = words.filter((w) => !w.learned)
  const currentWord = filteredWords[index]

  // Функция для перехода к следующему слову
  const handleNext = () => {
    if (!filteredWords.length) return
    const nextIndex = (index + 1) % filteredWords.length
    setIndex(nextIndex)
    setGradient(getRandomGradient())
  }

  // Функция для перехода к предыдущему слову
  const handlePrev = () => {
    if (!filteredWords.length) return
    const prevIndex = (index - 1 + filteredWords.length) % filteredWords.length
    setIndex(prevIndex)
    setGradient(getRandomGradient())
  }

  return (
    <div className="relative flex flex-col items-center w-full max-w-[440px] mx-auto h-[100dvh] bg-black overflow-hidden">
      {/* Навбар с прогрессом */}
      <Navbar
        totalCount={words.length}
        learnedCount={words.filter((w) => w.learned).length}
      />

      {/* Карточка слова */}
      <div className="flex-1 w-full overflow-hidden relative">
        <AnimatePresence mode="wait">
          {currentWord && (
            <WordCard
              key={currentWord.id}
              word={currentWord}
              gradient={gradient}
              onMarkAsLearned={() => {
                api
                  .patch(`/words/${currentWord.id}`, { learned: true })
                  .then(() => {
                    api.get('/words').then((res) => {
                      setWords(res.data)
                      handleNext()
                    })
                  })
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Кнопки навигации */}
      <div className="flex justify-center items-center gap-2 px-10 pb-14 pt-3 w-full">
        <button
          onClick={handlePrev}
          className="flex h-16 flex-col justify-center items-center gap-2 flex-1 rounded-[20px] bg-white/10 text-white"
        >
          Назад
        </button>
        <button
          onClick={handleNext}
          className="flex h-16 flex-col justify-center items-center gap-2 flex-1 rounded-[20px] bg-white/10 text-white"
        >
          Вперёд
        </button>
      </div>
    </div>
  )
}