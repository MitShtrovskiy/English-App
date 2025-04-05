import { motion } from 'framer-motion'
import { Switch } from '@/components/ui/switch'

interface WordCardProps {
  word: {
    id: number
    word: string
    transcription?: string
    translation: string
    example: string
    learned: boolean
  }
  direction: 'next' | 'prev'
}

const variants = {
  enter: (direction: 'next' | 'prev') => ({
    x: direction === 'next' ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: (direction: 'next' | 'prev') => ({
    x: direction === 'next' ? -100 : 100,
    opacity: 0,
    transition: { duration: 0.2 },
  }),
}

export default function WordCard({ word, direction }: WordCardProps) {
  const highlightedExample = word.example.replace(
    new RegExp(`\\b(${word.word})\\b`, 'gi'),
    '**$1**'
  )

  return (
    <motion.div
      key={word.id}
      className="bg-zinc-900 rounded-2xl shadow-xl p-6 space-y-4 w-full border border-zinc-800 text-white absolute"
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      variants={variants}
      layout
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold leading-tight">{word.word}</h2>
          {word.transcription && (
            <p className="text-sm text-muted-foreground mt-1">
              [{word.transcription}]
            </p>
          )}
        </div>
        <Switch checked={word.learned} disabled />
      </div>
      <p className="text-muted-foreground italic">{word.translation}</p>
      <p className="text-sm text-zinc-300">
        <span
          dangerouslySetInnerHTML={{
            __html: highlightedExample.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
          }}
        />
      </p>
    </motion.div>
  )
}