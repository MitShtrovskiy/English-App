import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  useEffect(() => {
    api.get('/words').then((res) => setWords(res.data))
  }, [])

  const current = words[index]

  const next = () => {
    setDirection('next')
    setIndex((prev) => (prev + 1) % words.length)
  }

  const prev = () => {
    setDirection('prev')
    setIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  return (
    <div className="flex flex-col justify-between items-center h-[90vh] px-4 py-6 max-w-[430px] mx-auto overflow-hidden">
      <div className="w-full h-full flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id}
              initial={{ x: direction === 'next' ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction === 'next' ? -300 : 300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <WordCard word={current} onRefresh={() => {
                api.get('/words').then((res) => setWords(res.data))
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex justify-between gap-4 w-full mt-6">
        <Button onClick={prev} className="w-full text-base font-semibold">Назад</Button>
        <Button onClick={next} className="w-full text-base font-semibold">Вперёд</Button>
      </div>
    </div>
  )
}