import { motion } from 'framer-motion'
import { EyeOff, Volume2, RefreshCcw, Check } from 'lucide-react'
import { useState } from 'react'
import { speak } from '../utils/speak'
import { cn } from '../utils/cn'
import { getRandomGradient } from '../utils/gradients'
import styles from './CardStyles'

interface WordCardProps {
  word: {
    id: number
    word: string
    translation: string
    example: string
    transcription?: string
    learned: boolean
  }
  isEnglish: boolean
  showTranslation: boolean
  onToggleLanguage: () => void
  onToggleTranslation: () => void
  onMarkAsLearned: () => void
}

export default function WordCard({
  word,
  isEnglish,
  showTranslation,
  onToggleLanguage,
  onToggleTranslation,
  onMarkAsLearned,
}: WordCardProps) {
  const [bg] = useState(getRandomGradient())
  const textToDisplay = isEnglish ? word.word : word.translation
  const translation = isEnglish ? word.translation : word.word

  const exampleParts = word.example.split(new RegExp(`(${word.word})`, 'i'))

  return (
    <motion.div
      className={cn(styles.card, bg)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {/* 🧠 Основной контент */}
      <div className="space-y-3 text-left">
        <h2 className="text-2xl font-bold text-white">{textToDisplay}</h2>
        {word.transcription && isEnglish && (
          <p className="text-sm text-muted-foreground">{word.transcription}</p>
        )}
        <p
          className={cn(
            'italic text-sm relative inline-block transition',
            !showTranslation && 'blur-sm select-none'
          )}
        >
          {translation}
        </p>
        <p className="text-sm text-white leading-relaxed">
          {exampleParts.map((part, i) =>
            part.toLowerCase() === word.word.toLowerCase() ? (
              isEnglish || showTranslation ? (
                <span key={i} className="font-bold text-white">
                  {part}
                </span>
              ) : (
                <span key={i} className="relative font-bold text-white">
                  {part}
                  <span className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-sm" />
                </span>
              )
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </p>
      </div>

      {/* 🎛 Контролы */}
      <div className={styles.controls}>
        <button onClick={onToggleTranslation}>
          <EyeOff className="w-5 h-5" />
        </button>
        <button onClick={() => speak(word.word)}>
          <Volume2 className="w-5 h-5" />
        </button>
        <button onClick={onToggleLanguage}>
          <RefreshCcw className="w-5 h-5" />
        </button>
        <button onClick={onMarkAsLearned} className={styles.learnedButton}>
          <Check className="w-4 h-4 mr-2" />
          Выучил
        </button>
      </div>
    </motion.div>
  )
}