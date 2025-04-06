import { useEffect, useState } from 'react'
import WordCard from '../components/WordCard'
import { api } from '../utils/api'
import Navbar from '../components/Navbar'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    api.get('/words').then((res) => {
      const notLearnedWords = res.data.filter((word: any) => !word.learned)
      setWords(notLearnedWords)
      setIndex(0)
    })
  }, [])

  const showPrevWord = () => {
    setIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  const showNextWord = () => {
    setIndex((prev) => (prev + 1) % words.length)
  }

  if (words.length === 0) {
    return (
      <>
        <Navbar />
        <div className="pt-16 flex items-center justify-center h-screen text-white">
          Нет слов
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-col h-[100dvh] max-w-[430px] mx-auto px-4 pt-16 pb-6 overflow-hidden">
        <div className="flex-1 flex items-center">
          <WordCard word={words[index]} />
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={showPrevWord} className="flex flex-col justify-center items-center gap-2 h-16 flex-1 rounded-2xl bg-white/10">
            <ChevronLeft />
            Назад
          </Button>
          <Button onClick={showNextWord} className="flex flex-col justify-center items-center gap-2 h-16 flex-1 rounded-2xl bg-white/10">
            <ChevronRight />
            Вперёд
          </Button>
        </div>
      </main>
    </>
  )
}