import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Volume2, EyeOff, RefreshCcw, Check } from 'lucide-react'
import { speak } from '../utils/speak'
import { Button } from '@/components/ui/button'

interface Word {
  id: number
  word: string
  translation: string
  example: string
  transcription?: string
  learned: boolean
}

interface Props {
  word: Word
  onMarkAsLearned?: () => void
}

const gradients = [
  'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)'
]

export default function WordCard({ word, onMarkAsLearned }: Props) {
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)

  // 🌈 Случайный градиент — фиксированный на ререндер
  const background = useMemo(() => {
    const index = word.id % gradients.length
    return gradients[index]
  }, [word.id])

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
      className="flex flex-col justify-between h-full w-full rounded-2xl p-6 text-white"
      style={{
        background,
        WebkitBackdropFilter: 'blur(10px)',
        backdropFilter: 'blur(10px)'
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
    >
      {/* 📱 Учёт safe-area-top */}
      <div className="pt-[env(safe-area-inset-top)]">
        <div className="space-y-1 text-left">
          <h2 className="text-2xl font-bold">{textToDisplay}</h2>
          {word.transcription && isEnglishFirst && (
            <p className="text-sm text-white/70">{word.transcription}</p>
          )}
        </div>

        <p
          className={`italic text-sm mt-3 relative inline-block transition duration-300 ${
            isTranslationHidden ? 'blur-sm select-none' : ''
          }`}
        >
          {translation}
        </p>

        <p className="mt-6 text-sm leading-relaxed">{highlightWordInExample()}</p>
      </div>

      {/* 📱 Safe-area-bottom + Контролы */}
      <div className="pt-6 pb-[env(safe-area-inset-bottom)] mt-auto">
        <div className="flex justify-between items-center gap-2 flex-wrap">
          <div className="flex gap-2">
            {/* 👁️ Hide Translation */}
            <Button variant="ghost" onClick={() => setIsTranslationHidden(!isTranslationHidden)} size="icon">
              <EyeOff className="w-5 h-5" />
            </Button>

            {/* 🔊 Sound */}
            <Button variant="ghost" onClick={() => speak(word.word)} size="icon">
              <Volume2 className="w-5 h-5" />
            </Button>

            {/* 🔁 Change Language */}
            <Button variant="ghost" onClick={() => setIsEnglishFirst(!isEnglishFirst)} size="icon">
              <RefreshCcw className="w-5 h-5" />
            </Button>
          </div>

          {/* ✅ Mark as Learned */}
          <Button onClick={onMarkAsLearned} variant="outline" className="ml-auto text-sm">
            <Check className="w-4 h-4 mr-2" />
            Выучил
          </Button>
        </div>
      </div>
    </motion.div>
  )
}