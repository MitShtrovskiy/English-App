import { useEffect, useState } from 'react'
import WordCard from '../components/WordCard'
import Navbar from '../components/Navbar'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right'>('right')

  useEffect(() => {
    fetchWords()
  }, [])

  const fetchWords = async () => {
    const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/words')
    const data = await response.json()
    setWords(data)
  }

  const nextCard = () => {
    setTransitionDirection('right')
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  const prevCard = () => {
    setTransitionDirection('left')
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  const currentWord = words[currentIndex]

  return (
    <div className="relative flex flex-col items-center w-full max-w-[440px] mx-auto h-[100dvh] bg-black overflow-hidden">
      {/* Навбар */}
      <Navbar
        totalCount={words.length}
        learnedCount={words.filter((w) => w.learned).length}
      />

      {/* Карточка слова */}
      <div className="flex flex-col items-start pt-[54px] w-full h-full">
        {currentWord && (
          <WordCard word={currentWord} direction={transitionDirection} />
        )}
      </div>

      {/* Навигация */}
      <div className="flex px-[40px] pb-[56px] pt-[12px] gap-2 w-full justify-center">
        <Button
          onClick={prevCard}
          className="flex h-[64px] flex-col justify-center items-center gap-[10px] flex-1 rounded-[20px] bg-white/10"
        >
          Назад
        </Button>
        <Button
          onClick={nextCard}
          className="flex h-[64px] flex-col justify-center items-center gap-[10px] flex-1 rounded-[20px] bg-white/10"
        >
          Вперёд
        </Button>
      </div>
    </div>
  )
}