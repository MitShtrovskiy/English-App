import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    api.get('/words').then((res) => setWords(res.data))
  }, [])

  const goNext = () => setIndex((prev) => (prev + 1) % words.length)
  const goPrev = () => setIndex((prev) => (prev - 1 + words.length) % words.length)

  const current = words[index]

  return (
    <div className="flex flex-col h-screen max-w-[430px] mx-auto px-4 py-6">
      <div className="flex-grow overflow-hidden">
        {current ? <WordCard word={current} /> : null}
      </div>

      <div className="flex gap-4 mt-6">
        <Button
          onClick={goPrev}
          className="flex flex-col justify-center items-center gap-2 flex-1 h-16 rounded-2xl bg-white/10 text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад
        </Button>
        <Button
          onClick={goNext}
          className="flex flex-col justify-center items-center gap-2 flex-1 h-16 rounded-2xl bg-white/10 text-white"
        >
          <ArrowRight className="w-5 h-5" />
          Вперёд
        </Button>
      </div>
    </div>
  )
}