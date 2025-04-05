import { useState } from 'react'
import { Volume2, Eye, Repeat, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import classNames from 'classnames'

interface WordCardProps {
  word: {
    id: number
    word: string
    translation: string
    transcription?: string
    example: string
  }
}

export default function WordCard({ word }: WordCardProps) {
  const [isEnglish, setIsEnglish] = useState(true)
  const [showTranslation, setShowTranslation] = useState(false)

  const displayWord = isEnglish ? word.word : word.translation
  const displayTranslation = isEnglish ? word.translation : word.word
  const shouldBlurExampleWord = !isEnglish && !showTranslation

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(word.word)
    speechSynthesis.speak(utterance)
  }

  const highlightedExample = word.example.replace(
    new RegExp(`\\b${word.word}\\b`, 'gi'),
    (match) =>
      `<span class="${classNames('font-bold', {
        'blur-sm text-transparent select-none': shouldBlurExampleWord,
      })}">${match}</span>`
  )

  return (
    <motion.div
      className="bg-zinc-900 rounded-3xl p-6 space-y-4 border border-zinc-800 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white leading-tight">{displayWord}</h2>
        {word.transcription && isEnglish && (
          <p className="text-sm text-zinc-400">{word.transcription}</p>
        )}
        <div className="relative">
          <p
            className={classNames(
              'text-sm transition-all',
              showTranslation ? 'text-zinc-300' : 'text-zinc-500 blur-sm'
            )}
          >
            {displayTranslation}
          </p>
          {!showTranslation && (
            <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm rounded"></div>
          )}
        </div>
      </div>

      <div className="text-sm text-zinc-400">
        <span dangerouslySetInnerHTML={{ __html: highlightedExample }} />
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => setIsEnglish((prev) => !prev)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
        >
          <Repeat className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={() => setShowTranslation((prev) => !prev)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
        >
          <Eye className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={speak}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
        >
          <Volume2 className="w-5 h-5 text-white" />
        </button>

        <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          Выучил
        </button>
      </div>
    </motion.div>
  )
}