import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get('/words')
      .then((res) => {
        setWords(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <span className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full" />
      </div>
    )
  }

  if (words.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-black">
        <p>Нет слов для отображения</p>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center justify-between h-[100dvh] bg-black text-white max-w-[430px] mx-auto overflow-hidden">
      <Navbar />

      <div className="flex-1 w-full p-4 pt-2 flex items-start justify-center">
        <WordCard word={words[currentIndex]} />
      </div>

      <div className="flex gap-4 px-4 pb-6 w-full">
        <Button onClick={prevCard} className="flex-1 h-16 rounded-[20px] bg-white/10">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Назад
        </Button>
        <Button onClick={nextCard} className="flex-1 h-16 rounded-[20px] bg-white/10">
          Вперёд
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}