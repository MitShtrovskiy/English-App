import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import WordCard from '../components/WordCard'
import Navbar from '../components/Navbar'
import { api } from '../utils/api'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    api.get('/words').then((res) => setWords(res.data))
  }, [])

  const next = () => setIndex((prev) => (prev + 1) % words.length)
  const prev = () =>
    setIndex((prev) => (prev - 1 + words.length) % words.length)

  const markAsLearned = (id: number) => {
    api.patch(`/words/${id}`, { learned: true }).then(() => {
      api.get('/words').then((res) => setWords(res.data))
    })
  }

  const currentWord = words[index]

  return (
    <div className="relative flex flex-col items-center w-full max-w-[440px] mx-auto h-[100dvh] bg-black overflow-hidden">
      <Navbar
        totalCount={words.length}
        learnedCount={words.filter((word) => word.learned).length}
      />

      <div className="flex-1 w-full flex items-center justify-center px-4 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentWord && (
            <WordCard
              key={currentWord.id}
              word={currentWord}
              onMarkAsLearned={() => markAsLearned(currentWord.id)}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex px-10 pb-14 pt-3 gap-2 w-full">
        <button
          onClick={prev}
          className="flex h-16 flex-col justify-center items-center gap-2 flex-1 rounded-[20px] bg-white/10 text-white text-sm"
        >
          Назад
        </button>
        <button
          onClick={next}
          className="flex h-16 flex-col justify-center items-center gap-2 flex-1 rounded-[20px] bg-white/10 text-white text-sm"
        >
          Вперёд
        </button>
      </div>
    </div>
  )
}