import { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, Eye, EyeOff, Repeat2 } from 'lucide-react'

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
  const [showTranslation, setShowTranslation] = useState(true)
  const [showEnglish, setShowEnglish] = useState(true)

  const highlightedExample = (showEnglish ? word.example : word.translation).replace(
    new RegExp(`\\b${word.word}\\b`, 'gi'),
    (match) => `<strong>${match}</strong>`
  )

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(word.word)
    utterance.lang = 'en-US'
    speechSynthesis.speak(utterance)
  }

  return (
    <motion.div
      className="bg-zinc-900 rounded-3xl shadow-2xl p-6 space-y-4 text-white w-full max-w-sm border border-zinc-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      {/* Заголовок */}
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-bold">{word.word}</h2>
        <p className="text-muted-foreground text-sm italic">{word.transcription}</p>
      </div>

      {/* Перевод с блюром */}
      <div className="relative">
        <div className="bg-zinc-800 text-center rounded-xl py-2 text-lg font-medium">
          {word.translation}
        </div>
        {!showTranslation && (
          <div className="absolute inset-0 rounded-xl backdrop-blur-sm bg-zinc-900/40" />
        )}
      </div>

      {/* Пример */}
      <div
        className="text-sm text-zinc-300"
        dangerouslySetInnerHTML={{ __html: highlightedExample }}
      />

      {/* Контролы */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setShowEnglish((prev) => !prev)}
          className="p-2 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition"
          title="Сменить язык"
        >
          <Repeat2 size={20} />
        </button>

        <button
          onClick={() => setShowTranslation((prev) => !prev)}
          className="p-2 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition"
          title="Показать/Скрыть перевод"
        >
          {showTranslation ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>

        <button
          onClick={speak}
          className="p-2 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition"
          title="Озвучить слово"
        >
          <Volume2 size={20} />
        </button>
      </div>
    </motion.div>
  )
}