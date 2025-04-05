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
}

export default function WordCard({ word }: WordCardProps) {
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)

  const textToDisplay = isEnglishFirst ? word.word : word.translation
  const translation = isEnglishFirst ? word.translation : word.word

  const gradient = `linear-gradient(135deg, #C2E9FB, #D4FC79)` // можешь заменить на динамический

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
              <span className="relative font-medium">
                {isEnglishFirst || !isTranslationHidden ? (
                  <span className="text-white font-bold">{matches[i]}</span>
                ) : (
                  <span className="relative">
                    <span className="text-white font-bold">{matches[i]}</span>
                    <span className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm rounded-sm" />
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
      className="w-full h-full rounded-3xl p-6 shadow-xl text-white flex flex-col justify-between"
      style={{
        background: gradient,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Верхняя часть */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold leading-tight">{textToDisplay}</h2>
        {word.transcription && isEnglishFirst && (
          <p className="text-sm text-white/80">{word.transcription}</p>
        )}
        <p
          className={`italic text-white/70 text-sm relative inline-block transition duration-300 ${
            isTranslationHidden ? 'blur-sm select-none' : ''
          }`}
        >
          {translation}
        </p>
      </div>

      {/* Пример */}
      <div className="text-sm text-white/90 mt-4 leading-relaxed">{highlightWordInExample()}</div>

      {/* Контролы */}
      <div className="flex justify-between items-center mt-6 gap-2 flex-wrap pt-6">
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setIsTranslationHidden(!isTranslationHidden)} size="icon">
            <EyeOff className="w-5 h-5" />
          </Button>
          <Button variant="ghost" onClick={playAudio} size="icon">
            <Volume2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" onClick={() => setIsEnglishFirst(!isEnglishFirst)} size="icon">
            <RefreshCcw className="w-5 h-5" />
          </Button>
        </div>

        <Button variant="outline" className="ml-auto text-sm bg-white/10 backdrop-blur-md">
          <Check className="w-4 h-4 mr-2" />
          Выучил
        </Button>
      </div>
    </motion.div>
  )
}