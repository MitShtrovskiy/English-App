import { useEffect, useState } from 'react'
import { getWords } from '../api'
import { Word } from '../types'
import WordCard from '../components/WordCard'
import Navbar from '../components/Navbar'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import '../styles/home.css'


export default function Home() {
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  useEffect(() => {
    const fetchWords = async () => {
      const data = await getWords()
      setWords(data)
    }
    fetchWords()
  }, [])

  const handlePrev = () => {
    if (isAnimating) return
    setDirection('left')
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? words.length - 1 : prevIndex - 1
      )
      setIsAnimating(false)
    }, 300)
  }

  const handleNext = () => {
    if (isAnimating) return
    setDirection('right')
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === words.length - 1 ? 0 : prevIndex + 1
      )
      setIsAnimating(false)
    }, 300)
  }

  const currentWord = words[currentIndex]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 🔼 Навбар */}
      <Navbar words={words} />

      {/* 📦 Карточка */}
      <div
        className={`safe-area-container px-4 flex justify-center transition-transform duration-500 ${
          isAnimating ? (direction === 'right' ? 'slide-in-right' : 'slide-in-left') : ''
        }`}
      >
        {currentWord && <WordCard word={currentWord} />}
      </div>

      {/* ⬅️➡️ Навигация */}
      <div className="flex px-10 pb-14 pt-3 gap-2 w-full justify-center items-center">
        <button
          onClick={handlePrev}
          className="h-16 flex-1 bg-white/10 rounded-2xl flex items-center justify-center text-white text-lg active:bg-white/10"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="h-16 flex-1 bg-white/10 rounded-2xl flex items-center justify-center text-white text-lg active:bg-white/10"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}