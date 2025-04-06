// src/components/WordCard.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { EyeOff, Volume2, RefreshCcw, Check } from 'lucide-react'
import { speak } from '@/utils/speak'
import { getRandomGradient } from '@/utils/gradients'
import '../styles/wordCardStyles.css'

interface WordCardProps {
  word: {
    id: number
    word: string
    translation: string
    example: string
    transcription?: string
    learned: boolean
  }
}

export default function WordCard({ word }: WordCardProps) {
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)
  const [gradient] = useState(getRandomGradient())

  const textToDisplay = isEnglishFirst ? word.word : word.translation
  const translation = isEnglishFirst ? word.translation : word.word

  const highlightWordInExample = () => {
    const regex = new RegExp(`\\b${word.word}\\b`, 'gi')
    const parts = word.example.split(regex)
    const matches = word.example.match(regex)

    return (
      <>
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {matches && matches[i] && (
              <span className="relative font-semibold">
                {isEnglishFirst || !isTranslationHidden ? (
                  <span className="text-white font-bold">{matches[i]}</span>
                ) : (
                  <span className="relative text-white font-bold">
                    {matches[i]}
                    <span className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-sm" />
                  </span>
                )}
              </span>
            )}
          </span>
        ))}
      </>
    )
  }

  return (
    <motion.div
      className={`word-card text-left ${gradient}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <div className="space-y-1">
        <h2 className="text-3xl font-bold text-white leading-tight">{textToDisplay}</h2>
        {isEnglishFirst && word.transcription && (
          <p className="text-sm text-white/80">{word.transcription}</p>
        )}
      </div>

      <p className={`text-sm italic text-white/80 transition ${isTranslationHidden ? 'blur-sm select-none' : ''}`}>
        {translation}
      </p>

      <p className="text-sm text-white mt-2">{highlightWordInExample()}</p>

      <div className="controls">
        <button onClick={() => setIsTranslationHidden(!isTranslationHidden)}>
          <EyeOff />
        </button>
        <button onClick={() => speak(word.word)}>
          <Volume2 />
        </button>
        <button onClick={() => setIsEnglishFirst(!isEnglishFirst)}>
          <RefreshCcw />
        </button>
        <button className="learned-button">
          <Check className="mr-1 w-4 h-4" />
          Выучил
        </button>
      </div>
    </motion.div>
  )
}