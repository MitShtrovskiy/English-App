import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Volume2, EyeOff, RefreshCcw, Check } from 'lucide-react'
import { speak } from '../utils/speak'
import { generateGradient } from '@/utils/gradients'

interface WordCardProps {
  word: {
    id: number
    word: string
    transcription?: string
    translation: string
    example: string
    learned: boolean
  }
  onRefresh?: () => void
}

export default function WordCard({ word, onRefresh }: WordCardProps) {
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)

  const displayWord = isEnglishFirst ? word.word : word.translation
  const translation = isEnglishFirst ? word.translation : word.word
  const gradient = generateGradient(word.id)

  const highlightExample = () => {
    const regex = new RegExp(`\\b${word.word}\\b`, 'gi')
    const parts = word.example.split(regex)
    const matches = word.example.match(regex)

    return parts.map((part, i) => (
      <span key={i}>
        {part}
        {matches && matches[i] && (
          <span className="relative font-bold text-white">
            {isEnglishFirst || !isTranslationHidden ? (
              matches[i]
            ) : (
              <>
                <span className="relative z-10">{matches[i]}</span>
                <span className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-sm z-20" />
              </>
            )}
          </span>
        )}
      </span>
    ))
  }

  return (
    <div
      className="rounded-3xl p-6 flex flex-col justify-between w-full h-full max-h-[calc(100dvh-200px)] overflow-hidden"
      style={{
        background: gradient,
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* 🌐 Основное слово и транскрипция */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">{displayWord}</h2>
        {word.transcription && isEnglishFirst && (
          <p className="text-sm text-muted-foreground">{word.transcription}</p>
        )}
        <p
          className={`italic text-muted-foreground text-sm transition duration-300 ${
            isTranslationHidden ? 'blur-sm select-none' : ''
          }`}
        >
          {translation}
        </p>
        <p className="text-sm text-zinc-100 mt-4">{highlightExample()}</p>
      </div>

      {/* 🎛 Контролы */}
      <div className="flex justify-between items-center mt-6 gap-2 flex-wrap">
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
        <Button variant="outline" size="sm">
          <Check className="w-4 h-4 mr-2" />
          Выучил
        </Button>
      </div>
    </div>
  )
}