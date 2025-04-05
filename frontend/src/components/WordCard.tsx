import { motion } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { Volume2, CheckCircle2 } from "lucide-react"

interface WordCardProps {
  word: {
    id: number
    word: string
    translation: string
    example: string
    learned: boolean
  }
}

export const WordCard = ({ word }: WordCardProps) => {
  return (
    <motion.div
      className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-6 w-full space-y-4 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      {/* ВЫУЧЕНО */}
      {word.learned && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-green-400 text-xs font-medium">
          <CheckCircle2 size={16} />
          Learned
        </div>
      )}

      {/* Слово + Озвучка */}
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-3xl font-bold text-white">{word.word}</h2>
        <button
          className="text-zinc-400 hover:text-white transition"
          aria-label="Play pronunciation"
          onClick={() => console.log("🔊 TODO: play audio")}
        >
          <Volume2 size={24} />
        </button>
      </div>

      {/* Перевод */}
      <p className="text-lg text-zinc-400 italic">"{word.translation}"</p>

      {/* Пример */}
      <p className="text-sm text-zinc-300">{word.example}</p>

      {/* Тумблер */}
      <div className="flex justify-between items-center pt-2 border-t border-zinc-800 mt-4">
        <span className="text-sm text-zinc-400">Mark as learned</span>
        <Switch checked={word.learned} disabled />
      </div>
    </motion.div>
  )
}