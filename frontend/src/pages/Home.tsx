// ✅ В WordCard.tsx
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

const WordCard = ({ word }: WordCardProps) => {
  return (
    <motion.div
      className="bg-zinc-900 rounded-2xl shadow-lg p-6 space-y-3 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{word.word}</h2>
        <Switch checked={word.learned} disabled />
      </div>
      <p className="text-muted-foreground text-sm italic">"{word.translation}"</p>
      <p className="text-sm text-zinc-300">{word.example}</p>
    </motion.div>
  )
}

export default WordCard // 👈 теперь можно импортировать по умолчанию