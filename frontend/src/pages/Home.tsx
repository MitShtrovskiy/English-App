import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    api.get('/words').then((res) => setWords(res.data))
  }, [])

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  const currentWord = words[currentIndex]

  return (
    <div className="max-w-[430px] mx-auto p-4 space-y-6 mb-20">
      {currentWord && (
        <WordCard word={currentWord} />
      )}

      <div className="flex justify-between gap-4">
        <button
          onClick={prev}
          className="flex flex-col justify-center items-center gap-2 w-[176px] h-16 bg-white/10 rounded-2xl text-white text-sm font-medium"
        >
          Назад
        </button>
        <button
          onClick={next}
          className="flex flex-col justify-center items-center gap-2 w-[176px] h-16 bg-white/10 rounded-2xl text-white text-sm font-medium"
        >
          Вперёд
        </button>
      </div>
    </div>
  )
}