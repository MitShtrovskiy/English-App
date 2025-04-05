import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Volume2, EyeOff, RefreshCcw, Check } from 'lucide-react'
import { speak } from '../utils/speak'

interface WordCardProps {
  word: {
    id: number
    word: string
    translation: string
    transcription?: string
    example: string
    learned: boolean
  }
  onLearned?: () => void
}

export default function WordCard({ word, onLearned }: WordCardProps) {
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)

  const showTranslation = !isTranslationHidden
  const isRussian = !isEnglishFirst
  const displayWord = isEnglishFirst ? word.word : word.translation
  const displayTranslation = isEnglishFirst ? word.translation : word.word

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
              <span className="relative font-bold text-white">
                {isRussian && !showTranslation ? (
                  <>
                    <span>{matches[i]}</span>
                    <span className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm rounded-sm" />
                  </>
                ) : (
                  matches[i]
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
      className="flex flex-col justify-between h-full bg-gradient-to-br from-[#1E1E1E] via-[#2C2C2C] to-[#1A1A1A] rounded-3xl shadow-xl px-6 py-8 space-y-6 border border-zinc-800"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      layout
    >
      <div className="space-y-1 text-left">
        <h2 className="text-2xl font-bold text-white break-words">{displayWord}</h2>
        {word.transcription && isEnglishFirst && (
          <p className="text-sm text-muted-foreground">{word.transcription}</p>
        )}
        <p
          className={`italic text-muted-foreground text-sm transition duration-300 ${
            isTranslationHidden ? 'blur-sm select-none' : ''
          }`}
        >
          {displayTranslation}
        </p>
      </div>

      <p className="text-sm text-zinc-300 leading-relaxed">{highlightWordInExample()}</p>

      <div className="flex justify-between items-center mt-4 gap-2 flex-wrap">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsTranslationHidden(!isTranslationHidden)}>
            <EyeOff className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => speak(word.word)}>
            <Volume2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsEnglishFirst(!isEnglishFirst)}>
            <RefreshCcw className="w-5 h-5" />
          </Button>
        </div>

        <Button
          variant="outline"
          className="ml-auto text-sm"
          onClick={onLearned}
        >
          <Check className="w-4 h-4 mr-2" />
          Выучил
        </Button>
      </div>
    </motion.div>
  )
}