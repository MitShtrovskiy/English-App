import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'

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

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % words.length)
  }

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  if (!words.length) {
    return (
      <>
        <Navbar />
        <div className="pt-16 flex items-center justify-center h-screen text-white">
          Нет слов для изучения
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="pt-16 h-[calc(100vh-64px)] flex flex-col justify-between max-w-[430px] mx-auto px-4">
        <div className="flex-1 flex items-center justify-center">
          <WordCard word={words[index]} />
        </div>
        <div className="flex gap-4 pb-6">
          <Button
            onClick={handlePrev}
            className="flex flex-col justify-center items-center gap-2 flex-1 h-16 rounded-[20px] bg-white/10 text-white text-base"
          >
            <ChevronLeft className="w-5 h-5" />
            Назад
          </Button>
          <Button
            onClick={handleNext}
            className="flex flex-col justify-center items-center gap-2 flex-1 h-16 rounded-[20px] bg-white/10 text-white text-base"
          >
            <ChevronRight className="w-5 h-5" />
            Вперёд
          </Button>
        </div>
      </div>
    </>
  )
}