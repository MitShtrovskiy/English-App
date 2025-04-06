// Импорты
import { useEffect, useState } from 'react'
import WordCard from '../components/WordCard'
import { api } from '../utils/api'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Загрузка слов с бэка
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

  // Навигация между словами
  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  const currentWord = words[currentIndex]

  return (
    <div className="flex flex-col min-h-screen items-center justify-between p-4 pb-6 max-w-[430px] mx-auto overflow-hidden">
      {/* Карточка слова */}
      <div className="flex-1 w-full transition-all duration-500">
        {currentWord ? (
          <WordCard word={currentWord} onRefresh={fetchWords} />
        ) : (
          <div className="text-center text-zinc-400 mt-20">
            Все слова выучены 🎉
          </div>
        )}
      </div>

      {/* Кнопки навигации */}
      <div className="flex gap-4 mt-6 w-full">
        <Button
          onClick={prevCard}
          className="flex flex-col justify-center items-center h-16 flex-1 rounded-[20px] bg-white/10 text-white active:bg-white/10"
        >
          <ChevronLeft className="w-6 h-6" />
          Назад
        </Button>
        <Button
          onClick={nextCard}
          className="flex flex-col justify-center items-center h-16 flex-1 rounded-[20px] bg-white/10 text-white active:bg-white/10"
        >
          <ChevronRight className="w-6 h-6" />
          Вперёд
        </Button>
      </div>
    </div>
  )
}