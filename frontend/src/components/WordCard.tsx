import { useState } from 'react'
import { motion } from 'framer-motion'

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
              <span className="relative font-medium">
                {isEnglishFirst || !isTranslationHidden ? (
                  <span className="text-white font-bold">{matches[i]}</span>
                ) : (
                  <span className="relative">
                    <span className="text-white font-bold">{matches[i]}</span>
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
      className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 space-y-6 shadow-xl w-full min-h-[400px] flex flex-col justify-start"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <div className="text-left space-y-1">
        <h2 className="text-2xl font-bold text-white">{textToDisplay}</h2>
        {word.transcription && isEnglishFirst && (
          <p className="text-sm text-white/70">{word.transcription}</p>
        )}
      </div>

      <p
        className={`italic text-white/80 text-sm relative inline-block transition duration-300 ${
          isTranslationHidden ? 'blur-sm select-none' : ''
        }`}
      >
        {translation}
      </p>

      <p className="text-sm text-white">{highlightWordInExample()}</p>
    </motion.div>
  )
}