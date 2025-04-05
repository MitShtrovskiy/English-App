import { useEffect, useState } from 'react'
import WordCard from '../components/WordCard'
import { api } from '../utils/api'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    api.get('/words').then((res) => setWords(res.data))
  }, [])

  const next = () => setIndex((prev) => (prev + 1) % words.length)
  const prev = () => setIndex((prev) => (prev - 1 + words.length) % words.length)

  const word = words[index]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col max-w-[430px] mx-auto">
      {/* Навбар */}
      <div className="h-16 px-4 flex items-center justify-between bg-black/60 backdrop-blur-lg border-b border-white/10">
        <Button variant="ghost">📄 Список</Button>
        <Button variant="ghost">⬆️ Загрузить</Button>
      </div>

      {/* Контент карточки */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        {word && <WordCard key={word.id} word={word} />}
      </div>

      {/* Навигация */}
      <div className="px-4 pb-6 flex justify-between gap-4">
        <Button onClick={prev} className="flex h-16 flex-col justify-center items-center gap-2 flex-1 rounded-2xl bg-white/10">
          Назад
        </Button>
        <Button onClick={next} className="flex h-16 flex-col justify-center items-center gap-2 flex-1 rounded-2xl bg-white/10">
          Вперёд
        </Button>
      </div>
    </div>
  )
}