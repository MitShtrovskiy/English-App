// Home.tsx

import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    api.get('/words').then((res) => {
      const filtered = res.data.filter((w: any) => !w.learned)
      setWords(filtered)
      setIndex(0)
    })
  }, [])

  const nextCard = () => setIndex((prev) => (prev + 1) % words.length)
  const prevCard = () => setIndex((prev) => (prev - 1 + words.length) % words.length)

  const currentWord = words[index]

  return (
    <div
      className="flex w-[440px] h-[956px] pt-[54px] flex-col items-start flex-shrink-0 mx-auto overflow-hidden"
      // Контейнер карточки: размеры и padding сверху, как в макете
    >
      <div className="flex flex-col items-start flex-1 w-full">
        {currentWord && (
          <WordCard word={currentWord} key={currentWord.id} />
        )}
      </div>

      {/* 🔽 Кнопки Вперёд / Назад — вне карточки */}
      <div className="flex justify-between gap-4 px-4 w-full mt-4 mb-4">
        <button
          className="flex h-[64px] flex-col justify-center items-center gap-[10px] flex-1 rounded-[20px] bg-white/10 text-white text-lg active:bg-transparent"
          onClick={prevCard}
        >
          <ArrowLeft className="w-5 h-5" />
          Назад
        </button>
        <button
          className="flex h-[64px] flex-col justify-center items-center gap-[10px] flex-1 rounded-[20px] bg-white/10 text-white text-lg active:bg-transparent"
          onClick={nextCard}
        >
          <ArrowRight className="w-5 h-5" />
          Вперёд
        </button>
      </div>
    </div>
  )
}