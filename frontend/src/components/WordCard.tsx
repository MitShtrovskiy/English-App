import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Volume2, EyeOff, RefreshCcw, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { speak } from '../utils/speak'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

interface WordCardProps {
  word: {
    id: number
    word: string
    translation: string
    transcription?: string
    example: string
    learned: boolean
  }
  onNext: () => void
  onPrev: () => void
}

export default function WordCard({ word, onNext, onPrev }: WordCardProps) {
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)

  const showTranslation = !isTranslationHidden
  const isEnglish = isEnglishFirst
  const displayedWord = isEnglish ? word.word : word.translation
  const translation = isEnglish ? word.translation : word.word

  const gradient = useMemo(() => {
    const gradients = [
      'from-pink-500 via-red-500 to-yellow-500',
      'from-blue-500 via-purple-500 to-pink-500',
      'from-green-400 via-blue-500 to-purple-600',
      'from-yellow-400 via-red-500 to-pink-500',
      'from-indigo-400 via-purple-400 to-pink-400',
    ]
    return gradients[Math.floor(Math.random() * gradients.length)]
  }, [])

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
                {isEnglish || showTranslation ? (
                  <span className="text-white font-bold">{matches[i]}</span>
                ) : (
                  <span className="relative text-white font-bold">
                    {matches[i]}
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      layout
      className={cn(
        'relative rounded-[32px] w-full h-full flex flex-col justify-between p-6 text-white',
        'bg-gradient-to-br', gradient,
        'backdrop-blur-lg shadow-2xl'
      )}
    >
      {/* Слово и транскрипция */}
      <div className="space-y-1">
        <h2 className="text-3xl font-bold leading-snug">{displayedWord}</h2>
        {isEnglish && word.transcription && (
          <p className="text-sm text-white/70">{word.transcription}</p>
        )}
      </div>

      {/* Перевод */}
      <p
        className={cn(
          'italic text-white/90 text-base transition duration-300 mt-4',
          isTranslationHidden ? 'blur-sm select-none' : ''
        )}
      >
        {translation}
      </p>

      {/* Пример */}
      <p className="text-sm text-white/90 mt-4 leading-relaxed">
        {highlightWordInExample()}
      </p>

      {/* Контролы */}
      <div className="mt-auto pt-6">
        <div className="flex justify-between gap-2">
          {/* Язык / Перевод / Озвучка */}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsTranslationHidden(!isTranslationHidden)} size="icon">
              <EyeOff className="w-5 h-5" />
            </Button>
            <Button variant="ghost" onClick={() => speak(word.word)} size="icon">
              <Volume2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" onClick={() => setIsEnglishFirst(!isEnglishFirst)} size="icon">
              <RefreshCcw className="w-5 h-5" />
            </Button>
          </div>

          {/* Кнопка "Выучил" */}
          <Button variant="outline" className="text-sm">
            <Check className="w-4 h-4 mr-2" />
            Выучил
          </Button>
        </div>

        {/* Навигация */}
        <div className="flex gap-4 mt-6">
          <Button
            onClick={onPrev}
            className="flex flex-col justify-center items-center gap-2 flex-1 h-16 rounded-[20px] bg-white/10 text-white text-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            Назад
          </Button>
          <Button
            onClick={onNext}
            className="flex flex-col justify-center items-center gap-2 flex-1 h-16 rounded-[20px] bg-white/10 text-white text-sm"
          >
            <ChevronRight className="w-5 h-5" />
            Вперёд
          </Button>
        </div>
      </div>
    </motion.div>
  )
}