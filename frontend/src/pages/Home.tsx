import { useEffect, useState } from 'react'
import { getWords } from '../api'
import { Word } from '../types'
import WordCard from '../components/WordCard'
import Navbar from '../components/Navbar'
import NavigationButtons from '../components/NavigationButtons'

export default function Home() {
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // 🧠 Получаем слова с сервера
  useEffect(() => {
    getWords()
      .then((data) => {
        console.log('Полученные слова:', data) // 🔍 Лог для отладки
        setWords(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Ошибка при загрузке слов:', error)
        setIsLoading(false)
      })
  }, [])

  // ⏩ Следующая карточка
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  // ⏪ Предыдущая карточка
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  // 🌀 Если идёт загрузка — показываем лоадер
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-lg">Загрузка слов...</div>
      </div>
    )
  }

  // ❌ Если слов нет вообще — покажем сообщение
  if (!words.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-lg">Слов нет. Загрузите их через «Upload»</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center pt-safe">
      {/* 🔝 Навбар */}
      <Navbar totalWords={words.length} learnedWords={words.filter(w => w.learned).length} />

      {/* 🧠 Карточка слова */}
      <div className="flex flex-1 items-center justify-center w-full">
        <WordCard key={words[currentIndex].id} word={words[currentIndex]} />
      </div>

      {/* 🔽 Кнопки навигации */}
      <NavigationButtons onNext={handleNext} onPrev={handlePrev} />
    </div>
  )
}