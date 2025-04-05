import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    api.get('/words').then((res) => setWords(res.data))
  }, [])

  const next = () => {
    setIndex((prev) => (prev + 1) % words.length)
  }

  const prev = () => {
    setIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  const currentWord = words[index]

  return (
    <div className="flex flex-col items-center justify-center h-screen max-w-[430px] mx-auto px-4 overflow-hidden space-y-6">
      {currentWord && <WordCard word={currentWord} />}

      <div className="flex justify-between w-full max-w-sm mt-4 space-x-4">
        <button
          onClick={prev}
          className="flex-1 bg-zinc-800 text-white py-3 rounded-xl shadow-md"
        >
          ← Назад
        </button>
        <button
          onClick={next}
          className="flex-1 bg-zinc-800 text-white py-3 rounded-xl shadow-md"
        >
          Вперёд →
        </button>
      </div>
    </div>
  )
}