import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Volume2, EyeOff, RefreshCcw, Check } from 'lucide-react'

interface WordCardProps {
  word: {
    id: number
    word: string
    transcription?: string
    translation: string
    example: string
    learned: boolean
  }
}

export default function WordCard({ word }: WordCardProps) {
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)

  const displayWord = isEnglishFirst ? word.word : word.translation
  const translation = isEnglishFirst ? word.translation : word.word

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.word)
    utterance.lang = 'en-US'
    speechSynthesis.speak(utterance)
  }

  const highlightExample = () => {
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
                {isEnglishFirst || !isTranslationHidden ? (
                  matches[i]
                ) : (
                  <>
                    {matches[i]}
                    <span className="absolute inset-0 bg-zinc-900/70 backdrop-blur-sm rounded-sm" />
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
      className="relative h-full w-full bg-gradient-to-br from-[#1C1C1E] via-[#29292B] to-[#1F1F21] p-6 rounded-[28px] flex flex-col justify-between"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2 text-left">
        <h2 className="text-2xl font-bold text-white">{displayWord}</h2>
        {isEnglishFirst && word.transcription && (
          <p className="text-sm text-muted-foreground">{word.transcription}</p>
        )}
        <p
          className={`text-sm italic text-muted-foreground transition duration-300 ${
            isTranslationHidden ? 'blur-sm select-none' : ''
          }`}
        >
          {translation}
        </p>
      </div>

      <div className="mt-6 text-sm text-zinc-300 leading-relaxed">
        {highlightExample()}
      </div>

      <div className="flex justify-between items-center mt-6 gap-2 flex-wrap">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsTranslationHidden(!isTranslationHidden)}>
            <EyeOff className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={playAudio}>
            <Volume2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsEnglishFirst(!isEnglishFirst)}>
            <RefreshCcw className="w-5 h-5" />
          </Button>
        </div>
        <Button variant="outline" className="ml-auto text-sm rounded-xl">
          <Check className="w-4 h-4 mr-2" />
          Выучил
        </Button>
      </div>
    </motion.div>
  )
}