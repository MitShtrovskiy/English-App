import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Volume2, EyeOff, RefreshCcw, Check } from 'lucide-react'

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

export default function WordCard({ word, onRefresh }: WordCardProps) {
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)

  const textToDisplay = isEnglishFirst ? word.word : word.translation
  const translation = isEnglishFirst ? word.translation : word.word

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.word)
    utterance.lang = 'en-US'
    speechSynthesis.speak(utterance)
  }

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
              <span className="bg-zinc-900 text-zinc-900 blur-sm px-1 rounded-sm">
                {matches[i]}
              </span>
            )}
          </span>
        ))}
      </>
    )
  }

  return (
    <motion.div
      className="bg-zinc-900 rounded-2xl shadow-xl p-6 space-y-4 w-full border border-zinc-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <div className="space-y-2">
        <div className="text-left">
          <h2 className="text-2xl font-bold leading-tight text-white">{textToDisplay}</h2>
          {word.transcription && (
            <p className="text-sm text-muted-foreground mt-1">{word.transcription}</p>
          )}
        </div>
        <p
          className={`italic text-muted-foreground text-sm relative inline-block ${
            isTranslationHidden ? 'blur-sm' : ''
          }`}
        >
          {translation}
        </p>
        <p className="text-sm text-zinc-300 mt-4">{highlightWordInExample()}</p>
      </div>

      <div className="flex justify-between mt-6 gap-2 flex-wrap">
        <Button variant="ghost" onClick={() => setIsTranslationHidden(!isTranslationHidden)} size="icon">
          <EyeOff className="w-5 h-5" />
        </Button>
        <Button variant="ghost" onClick={playAudio} size="icon">
          <Volume2 className="w-5 h-5" />
        </Button>
        <Button variant="ghost" onClick={() => setIsEnglishFirst(!isEnglishFirst)} size="icon">
          <RefreshCcw className="w-5 h-5" />
        </Button>
        <Button variant="outline" className="ml-auto">
          <Check className="w-4 h-4 mr-2" />
          Выучил
        </Button>
      </div>
    </motion.div>
  )
}