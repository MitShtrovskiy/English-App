import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Eye, EyeOff, Repeat, CheckCircle } from 'lucide-react'

interface Word {
  id: number
  word: string
  translation: string
  transcription?: string
  example: string
  learned: boolean
}

interface WordCardProps {
  word: Word
}

export default function WordCard({ word }: WordCardProps) {
  const [isEnglish, setIsEnglish] = useState(true)
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    speechSynthesis.speak(utterance)
  }

  const highlight = (example: string, word: string) =>
    example.replace(
      new RegExp(`\\b${word}\\b`, 'gi'),
      (match) =>
        `<strong class="${
          isEnglish ? 'text-white' : 'blur-sm text-transparent'
        } transition-all duration-500">${match}</strong>`
    )

  return (
    <motion.div
      className="bg-zinc-900 rounded-2xl shadow-xl p-6 space-y-4 w-full border border-zinc-800 text-left"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <div className="flex justify-between items-center">
        <div>
          <AnimatePresence mode="wait">
            <motion.h2
              key={isEnglish ? 'eng' : 'rus'}
              className="text-2xl font-bold leading-tight text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {isEnglish ? word.word : word.translation}
            </motion.h2>
          </AnimatePresence>

          {isEnglish && word.transcription && (
            <span className="text-sm text-muted-foreground ml-1">
              [{word.transcription}]
            </span>
          )}
        </div>
        <button
          onClick={() => setIsEnglish((prev) => !prev)}
          className="text-muted-foreground hover:text-white"
          title="Сменить язык"
        >
          <Repeat className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={isTranslationHidden ? 'hidden' : 'visible'}
          className={`italic text-sm ${
            isTranslationHidden
              ? 'blur-sm text-transparent'
              : 'text-muted-foreground'
          } transition-all`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {isEnglish ? word.translation : word.word}
        </motion.p>
      </AnimatePresence>

      <motion.p
        className="text-sm text-zinc-300 transition-all"
        dangerouslySetInnerHTML={{
          __html: highlight(word.example, word.word),
        }}
      />

      <div className="flex justify-between items-center pt-2 border-t border-zinc-800 mt-4">
        <div className="flex space-x-3">
          <button
            onClick={() => speak(isEnglish ? word.word : word.translation)}
            title="Озвучить"
          >
            <Volume2 className="w-5 h-5 text-muted-foreground hover:text-white" />
          </button>

          <button
            onClick={() => setIsTranslationHidden((prev) => !prev)}
            title="Показать/скрыть перевод"
          >
            {isTranslationHidden ? (
              <Eye className="w-5 h-5 text-muted-foreground hover:text-white" />
            ) : (
              <EyeOff className="w-5 h-5 text-muted-foreground hover:text-white" />
            )}
          </button>
        </div>

        <button title="Пометить как выученное">
          <CheckCircle className="w-5 h-5 text-green-500 hover:text-green-400" />
        </button>
      </div>
    </motion.div>
  )
}