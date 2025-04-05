import { useEffect, useState } from 'react'
import WordCard from '../components/WordCard'
import { api } from '../utils/api'
import { ArrowLeft, ArrowRight, ListPlus, Upload } from 'lucide-react'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    api.get('/words').then((res) => setWords(res.data))
  }, [])

  const currentWord = words[index]

  const next = () => {
    setIndex((prev) => (prev + 1) % words.length)
  }

  const prev = () => {
    setIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  return (
    <div className="relative min-h-screen flex flex-col px-4 pb-[env(safe-area-inset-bottom)] max-w-[430px] mx-auto bg-black overflow-hidden">
      <header className="flex justify-between items-center px-2 py-4 z-10">
        <button className="text-white p-2">
          <ListPlus className="w-6 h-6" />
        </button>
        <button className="text-white p-2">
          <Upload className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-grow flex items-start pt-2 justify-center">
        {currentWord && <WordCard word={currentWord} />}
      </main>

      <footer className="flex gap-4 mt-4 mb-8">
        <button
          className="flex flex-col justify-center items-center h-16 flex-1 gap-2 rounded-[20px] bg-white/10 text-white"
          onClick={prev}
        >
          <ArrowLeft className="w-5 h-5" />
          Назад
        </button>
        <button
          className="flex flex-col justify-center items-center h-16 flex-1 gap-2 rounded-[20px] bg-white/10 text-white"
          onClick={next}
        >
          <ArrowRight className="w-5 h-5" />
          Вперёд
        </button>
      </footer>
    </div>
  )
}