import { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, EyeOff, RefreshCcw, Check } from 'lucide-react'
import { speak } from '@/utils/speak'

// Типизация пропсов
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

  const handleSpeak = () => speak(word.word)

  // 💬 Выделение слова в примере + блюр
  const renderExample = () => {
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
                <span className="absolute inset-0 bg-white/10 backdrop-blur-[40px] rounded-sm z-20" />
              </>
            )}
          </span>
        )}
      </span>
    ))
  }

  // 🎨 Случайный градиент из предустановленных
  const gradients = [
    'from-pink-500 to-yellow-500',
    'from-indigo-500 to-purple-600',
    'from-green-400 to-blue-500',
    'from-orange-400 to-red-500',
    'from-cyan-400 to-blue-600',
    'from-teal-400 to-lime-500',
    'from-rose-400 to-pink-500',
    'from-fuchsia-500 to-violet-600',
    'from-sky-400 to-blue-700',
  ]
  const randomGradient = gradients[word.id % gradients.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      layout
      className={`rounded-[32px] w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br ${randomGradient} text-white`}
    >
      {/* 🧠 Контент карточки */}
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold">{textToDisplay}</h2>
          {isEnglishFirst && word.transcription && (
            <p className="text-white/90 text-base">{word.transcription}</p>
          )}
        </div>
        <p
          className={`text-lg italic relative transition-all duration-300 ${
            isTranslationHidden ? 'blur-sm select-none' : ''
          }`}
        >
          {translation}
        </p>
        <p className="text-base leading-relaxed text-white/90">
          {renderExample()}
        </p>
      </div>

      {/* 🎛 Контролы */}
      <div className="mt-6 bg-white/10 rounded-[24px] p-1 flex items-center gap-1">
        {/* Кнопки контролов */}
        <button
          onClick={() => setIsTranslationHidden(!isTranslationHidden)}
          className="w-16 h-16 bg-white/20 rounded-[20px] flex justify-center items-center"
        >
          <EyeOff />
        </button>
        <button
          onClick={handleSpeak}
          className="w-16 h-16 bg-white/20 rounded-[20px] flex justify-center items-center"
        >
          <Volume2 />
        </button>
        <button
          onClick={() => setIsEnglishFirst(!isEnglishFirst)}
          className="w-16 h-16 bg-white/20 rounded-[20px] flex justify-center items-center"
        >
          <RefreshCcw />
        </button>

        {/* Кнопка "Выучил" */}
        <button
          onClick={() => {
            // 👇 Здесь можно позже добавить PATCH-запрос
            if (onRefresh) onRefresh()
          }}
          className="flex-1 h-16 bg-white/20 rounded-[20px] flex justify-center items-center gap-2 text-white"
        >
          <Check className="w-5 h-5" />
          <span className="text-sm">Выучил</span>
        </button>
      </div>
    </motion.div>
  )
}