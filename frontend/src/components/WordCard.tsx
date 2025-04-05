import { motion } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { api } from "@/utils/api"

type Word = {
  id: number
  word: string
  transcription: string
  translation: string
  example: string
  learned: boolean
}

type WordCardProps = {
  word: Word
  onStatusChange?: (id: number, learned: boolean) => void
}

export default function WordCard({ word, onStatusChange }: WordCardProps) {
  const [isLearned, setIsLearned] = useState(word.learned)
  const [loading, setLoading] = useState(false)

  const toggleLearned = async (checked: boolean) => {
    setIsLearned(checked)
    setLoading(true)
    try {
      await api.patch(`/words/${word.id}`, { learned: checked })
      onStatusChange?.(word.id, checked)
    } catch (err) {
      console.error("Ошибка при обновлении статуса:", err)
      setIsLearned(!checked) // откат при ошибке
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="p-4 bg-muted rounded-2xl shadow-md space-y-2"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">{word.word}</h2>
        <Switch checked={isLearned} onCheckedChange={toggleLearned} disabled={loading} />
      </div>
      <p className="text-muted-foreground text-sm">{word.transcription}</p>
      <p className="text-base">{word.translation}</p>
      <p className="text-sm italic opacity-70">{word.example}</p>
    </motion.div>
  )
}