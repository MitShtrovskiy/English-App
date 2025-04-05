import { useState } from 'react'
import { Eye, Volume2, RefreshCcw, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { speak } from '../utils/speak'
import classNames from 'classnames'

interface WordCardProps {
  word: {
    id: number
    word: string
    translation: string
    example: string
    transcription?: string
  }
  currentLang: 'en' | 'ru'
  showTranslation: boolean
  onToggleTranslation: () => void
  onToggleLanguage: () => void
  onMarkAsLearned: () => void
}

export default function WordCard({
  word,
  currentLang,
  showTranslation,
  onToggleTranslation,
  onToggleLanguage,
  onMarkAsLearned,
}: WordCardProps) {
  const displayWord = currentLang === 'en' ? word.word : word.translation
  const displayTranslation =
    currentLang === 'en' ? word.translation : word.word

  const shouldBlurExample =
    currentLang === 'ru' && !showTranslation

  const highlightedExample = word.example.replace(
    new RegExp(`\\b${word.word}\\b`, 'gi'),
    (match) =>
      `<span class="${shouldBlurExample ? 'blur-sm text-transparent bg-white/10' : 'font-semibold'}">${match}</span>`
  )

  return (
    <motion.div
      className="w-full p-6 rounded-3xl space-y-4 shadow-xl text-left text-white border border-white/10"
      style={{
        background: 'linear-gradient(136deg, #4522FF 0%, #B63EFF 100%)',
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      layout
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{displayWord}</h2>
          {word.transcription && currentLang === 'en' && (
            <p className="text-sm text-white/70">{word.transcription}</p>
          )}
        </div>
        <button onClick={onToggleLanguage}>
          <RefreshCcw className="w-5 h-5 text-white" />
        </button>
      </div>

      <div
        className={classNames(
          'text-lg font-semibold transition-all relative',
          !showTranslation && 'blur-sm text-transparent select-none'
        )}
      >
        {displayTranslation}
        {!showTranslation && (
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-md pointer-events-none" />
        )}
      </div>

      <p
        className="text-sm text-white/90"
        dangerouslySetInnerHTML={{ __html: highlightedExample }}
      />

      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-4">
          <button onClick={onToggleTranslation}>
            <Eye className="w-5 h-5 text-white" />
          </button>
          <button onClick={() => speak(word.word)}>
            <Volume2 className="w-5 h-5 text-white" />
          </button>
        </div>

        <button
          onClick={onMarkAsLearned}
          className="flex items-center gap-2 bg-white/20 text-white text-sm px-4 py-2 rounded-2xl"
        >
          <Check className="w-4 h-4" /> Выучил
        </button>
      </div>
    </motion.div>
  )
}