import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import Navbar from '../components/Navbar'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [index, setIndex] = useState(0)

  const fetchWords = async () => {
    const res = await api.get('/words')
    setWords(res.data)
  }

  const handleNext = () => {
    if (words.length === 0) return
    setIndex((prev) => (prev + 1) % words.length)
  }

  const handlePrev = () => {
    if (words.length === 0) return
    setIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  useEffect(() => {
    fetchWords()
  }, [])

  const currentWord = words[index]

  return (
    <div className="relative flex flex-col items-center w-full max-w-[440px] mx-auto h-[100dvh] bg-black overflow-hidden">
      <Navbar
        totalCount={words.length}
        learnedCount={words.filter((w) => w.learned).length}
      />

      <div className="flex flex-col w-full h-full pt-[54px] px-0">
        <div className="flex-1 flex justify-center items-center">
          {currentWord && (
            <WordCard word={currentWord} onRefresh={fetchWords} />
          )}
        </div>

        <div className="flex justify-center items-center gap-2 px-10 pb-14">
          <Button
            onClick={handlePrev}
            className="flex flex-col justify-center items-center h-[64px] flex-1 rounded-[20px] bg-white/10"
          >
            <ChevronLeft />
          </Button>
          <Button
            onClick={handleNext}
            className="flex flex-col justify-center items-center h-[64px] flex-1 rounded-[20px] bg-white/10"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}