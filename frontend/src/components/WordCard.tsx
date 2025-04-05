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
    example: string
    transcription?: string
    learned: boolean
  }
  onRefresh?: () => void
}

export default function WordCard({ word }: WordCardProps) {
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)

  const displayWord = isEnglishFirst ? word.word : word.translation
  const hiddenWord = isEnglishFirst ? word.translation : word.word
  const showTranscription = isEnglishFirst && word.transcription

  const highlightInExample = () => {
    const target = word.word
    const regex = new RegExp(`\\b${target}\\b`, 'gi')
    const parts = word.example.split(regex)
    const matches = word.example.match(regex)

    return (
      <>
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {matches && matches[i] && (
              <span className="relative font-bold text-white">
                {isEnglishFirst || !isTranslationHidden ? (
                  matches[i]
                ) : (
                  <>
                    <span>{matches[i]}</span>
                    <span className="absolute inset-0 backdrop-blur-sm bg-zinc-900/70 rounded-sm" />
                  </>
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
      className="flex flex-col justify-between h-full w-full bg-gradient-to-br from-[#343045] to-[#1B1B24] rounded-3xl p-6 shadow-xl border border-zinc-800 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <div className="text-left space-y-1">
        <h2 className="text-2xl font-bold text-white">{displayWord}</h2>
        {showTranscription && (
          <p className="text-sm text-muted-foreground">{word.transcription}</p>
        )}
      </div>

      <p
        className={`italic text-muted-foreground text-sm transition duration-300 inline-block ${
          isTranslationHidden ? 'blur-sm select-none' : ''
        }`}
      >
        {hiddenWord}
      </p>

      <p className="text-sm text-zinc-300 leading-relaxed">
        {highlightInExample()}
      </p>

      <div className="flex justify-between items-center mt-auto gap-2 flex-wrap">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => setIsTranslationHidden(!isTranslationHidden)}
            size="icon"
          >
            <EyeOff className="w-5 h-5" />
          </Button>
          <Button variant="ghost" onClick={() => speak(word.word)} size="icon">
            <Volume2 className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsEnglishFirst(!isEnglishFirst)}
            size="icon"
          >
            <RefreshCcw className="w-5 h-5" />
          </Button>
        </div>

        <Button variant="outline" className="ml-auto text-sm">
          <Check className="w-4 h-4 mr-2" />
          Выучил
        </Button>
      </div>
    </motion.div>
  )
}