// 📦 Импорты
import { useEffect, useState } from 'react'
import WordCard from '@/components/WordCard'
import { fetchWords } from '@/api'
import { Word } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '@/components/Navbar'

// 🎨 Стили и логика карточек
export default function Home() {
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadWords = async () => {
      const data = await fetchWords()
      setWords(data)
      setLoading(false)
    }

    loadWords()
  }, [])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  const currentWord = words[currentIndex]

  return (
    <div className="flex flex-col w-[440px] h-[956px] pt-[54px] items-start flex-shrink-0 bg-black text-white mx-auto overflow-hidden">
      {/* 🔝 Верхний навбар */}
      <Navbar />

      {/* 📄 Карточка слова */}
      <div className="flex flex-col items-start flex-1 w-full px-4">
        {loading ? (
          <div className="text-white text-center w-full">Загрузка...</div>
        ) : words.length === 0 ? (
          <div className="text-white text-center w-full">Слов нет</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWord.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <WordCard word={currentWord} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* ⬅️➡️ Кнопки навигации */}
      <div className="flex px-[40px] pb-[56px] pt-[12px] justify-center items-center gap-[8px] self-stretch">
        <button
          onClick={goToPrevious}
          className="flex h-[64px] flex-col justify-center items-center gap-[10px] flex-[1_0_0] rounded-[20px] bg-white/10 text-white active:bg-white/10"
        >
          ← Назад
        </button>
        <button
          onClick={goToNext}
          className="flex h-[64px] flex-col justify-center items-center gap-[10px] flex-[1_0_0] rounded-[20px] bg-white/10 text-white active:bg-white/10"
        >
          Вперёд →
        </button>
      </div>
    </div>
  )
}