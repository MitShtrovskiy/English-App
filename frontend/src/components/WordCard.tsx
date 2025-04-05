import { motion } from 'framer-motion'

interface Word {
  id: number
  word: string
  transcription: string
  translation: string
  example: string
  learned: boolean
}

interface Props {
  word: Word
}

export default function WordCard({ word }: Props) {
  const highlightedExample = word.example.replace(
    new RegExp(`\\b${word.word}\\b`, 'gi'),
    (match) => `<strong>${match}</strong>`
  )

  return (
    <motion.div
      className="bg-zinc-900 rounded-3xl shadow-2xl p-6 space-y-4 text-white w-full max-w-sm border border-zinc-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-bold">{word.word}</h2>
        <p className="text-muted-foreground text-sm italic">{word.transcription}</p>
      </div>

      <div className="bg-zinc-800 text-center rounded-xl py-2 text-lg font-medium">
        {word.translation}
      </div>

      <div
        className="text-sm text-zinc-300"
        dangerouslySetInnerHTML={{ __html: highlightedExample }}
      />
    </motion.div>
  )
}