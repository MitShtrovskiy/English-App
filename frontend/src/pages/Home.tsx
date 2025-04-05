import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1) // ➕ добавляем

  useEffect(() => {
    api.get('/words').then((res) => {
      const unlearned = res.data.filter((w: any) => !w.learned)
      setWords(unlearned)
    })
  }, [])

  const paginate = (dir: 1 | -1) => {
    if (!words.length) return
    setDirection(dir)
    setIndex((prev) => (prev + dir + words.length) % words.length)
  }

  const handleLearned = () => {
    const currentWord = words[index]
    api.patch(`/words/${currentWord.id}`, { learned: true }).then(() => {
      const updated = words.filter((w) => w.id !== currentWord.id)
      setWords(updated)
      if (updated.length > 0) {
        setIndex((prev) => prev % updated.length)
      }
    })
  }

  const currentWord = words[index]

  return (
    <div className="flex flex-col justify-between h-[100dvh] px-4 pb-[90px] pt-6 max-w-[430px] mx-auto">
      <div className="flex-1 relative w-full overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {currentWord && (
            <motion.div
              key={currentWord.id}
              className="absolute inset-0"
              custom={direction}
              initial={{ x: direction * 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -direction * 100, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <WordCard word={currentWord} onLearned={handleLearned} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center gap-4 mt-6">
        <Button
          onClick={() => paginate(-1)}
          className="flex h-16 flex-col justify-center items-center gap-2 flex-1 rounded-[20px] bg-white/10"
        >
          Назад
        </Button>
        <Button
          onClick={() => paginate(1)}
          className="flex h-16 flex-col justify-center items-center gap-2 flex-1 rounded-[20px] bg-white/10"
        >
          Вперёд
        </Button>
      </div>
    </div>
  )
}