import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchWords = async () => {
    try {
      setIsLoading(true)
      const res = await api.get('/words')
      const filtered = res.data.filter((word: any) => !word.learned)
      setWords(filtered)
      setCurrentIndex(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWords()
  }, [])

  const nextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  const prevWord = () => {
    setCurrentIndex((prev) =>
      prev - 1 < 0 ? words.length - 1 : prev - 1
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-xl">
        Загрузка...
      </div>
    )
  }

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white text-center px-6">
        <p className="text-2xl font-semibold mb-4">Все слова выучены 🎉</p>
        <Button onClick={fetchWords}>Загрузить снова</Button>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col justify-between max-w-[430px] h-[100dvh] mx-auto px-4 pt-[80px] pb-6 overflow-hidden">
      <WordCard word={words[currentIndex]} onRefresh={fetchWords} />

      {/* 🔁 Навигация */}
      <div className="flex justify-between mt-6 gap-4 px-1">
        <Button
          onClick={prevWord}
          className="flex flex-col justify-center items-center h-16 flex-1 gap-2 rounded-[20px] bg-white/10 text-white"
        >
          Назад
        </Button>
        <Button
          onClick={nextWord}
          className="flex flex-col justify-center items-center h-16 flex-1 gap-2 rounded-[20px] bg-white/10 text-white"
        >
          Вперёд
        </Button>
      </div>
    </div>
  )
}