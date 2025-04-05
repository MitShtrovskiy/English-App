import { motion } from 'framer-motion'
import { Switch } from '@/components/ui/switch'

interface WordCardProps {
  word: {
    id: number
    word: string
    translation: string
    example: string
    learned: boolean
  }
}

export default function WordCard({ word }: WordCardProps) {
  return (
    <motion.div
      className="bg-zinc-900 rounded-2xl shadow-xl p-6 space-y-4 w-full border border-zinc-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold leading-tight text-white">
          {word.word}
        </h2>
        <Switch checked={word.learned} disabled /> {/* Пока заглушка */}
      </div>
      <p className="text-muted-foreground italic text-sm">
        {word.translation}
      </p>
      <p className="text-sm text-zinc-300">{word.example}</p>
    </motion.div>
  )
}