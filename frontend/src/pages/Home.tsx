import { useEffect, useState } from 'react'
import WordCard from '../components/WordCard'
import { api } from '../utils/api'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // 🔄 Загрузка слов с бэкенда
  const fetchWords = async () => {
    try {
      const res = await api.get('/words')
      setWords(res.data.filter((word: any) => !word.learned))
      setCurrentIndex(0)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchWords()
  }, [])

  // 🔁 Навигация
  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  const currentWord = words[currentIndex]

  return (
    <div className="flex flex-col items-center justify-between min-h-screen max-w-[440px] mx-auto pt-[54px] overflow-hidden">
      {/* 🧠 Контент карточки */}
      <div className="flex flex-col items-start w-full h-full flex-1">
        {currentWord ? (
          <WordCard word={currentWord} onRefresh={fetchWords} />
        ) : (
          <div className="text-center text-white/50">Все слова выучены 🎉</div>
        )}
      </div>

      {/* 🔽 Навигация */}
      <div className="flex px-10 pb-14 pt-3 gap-2 w-full">
        <Button
          onClick={prevCard}
          className="flex flex-col justify-center items-center h-16 flex-1 rounded-[20px] bg-white/10 text-white"
        >
          <ChevronLeft className="w-6 h-6" />
          Назад
        </Button>
        <Button
          onClick={nextCard}
          className="flex flex-col justify-center items-center h-16 flex-1 rounded-[20px] bg-white/10 text-white"
        >
          <ChevronRight className="w-6 h-6" />
          Вперёд
        </Button>
      </div>
    </div>
  )
}