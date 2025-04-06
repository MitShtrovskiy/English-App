import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Volume2, EyeOff, RefreshCcw, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { speak } from '../utils/speak'

const gradients = [
  'from-pink-500 via-red-500 to-yellow-500',
  'from-purple-500 via-pink-500 to-red-500',
  'from-green-400 via-blue-500 to-purple-600',
  'from-yellow-400 via-orange-500 to-red-500',
  'from-cyan-500 via-blue-500 to-indigo-500',
  'from-fuchsia-500 via-pink-500 to-rose-500',
  'from-lime-500 via-green-500 to-emerald-500',
  'from-sky-500 via-blue-600 to-indigo-600',
  'from-amber-400 via-orange-500 to-red-600',
  // добавь ещё при желании
]

interface WordCardProps {
  word: {
    id: number
    word: string
    translation: string
    example: string
    transcription?: string
    learned: boolean
  }
  onRefresh: () => void
}

export default function WordCard({ word, onRefresh }: WordCardProps) {
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)

  const gradient = useMemo(() => {
    const index = Math.floor(Math.random() * gradients.length)
    return gradients[index]
  }, [word.id])

  const textToDisplay = isEnglishFirst ? word.word : word.translation
  const translation = isEnglishFirst ? word.translation : word.word

  const highlightWordInExample = () => {
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
                {/* 🌫️ светлый блюр */}
                <span className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-sm z-20" />
              </>
            )}
          </span>
        )}
      </span>
    ))
  }

  return (
    <motion.div
      className={`flex flex-col justify-between h-full w-full rounded-2xl shadow-xl border border-white/10 px-6 py-6 bg-gradient-to-br ${gradient} text-white relative z-0`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {/* 🧠 СЛОВО */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">{textToDisplay}</h2>
        {isEnglishFirst && word.transcription && (
          <p className="text-white text-sm opacity-80">{word.transcription}</p>
        )}
        {/* 🈳 Перевод */}
        <p
          className={`italic text-sm transition duration-300 ${
            isTranslationHidden ? 'blur-sm select-none' : ''
          }`}
        >
          {translation}
        </p>

        {/* 🧾 Пример */}
        <p className="text-sm leading-relaxed mt-4">
          {highlightWordInExample()}
        </p>
      </div>

      {/* 🎛️ КОНТРОЛЫ */}
      <div className="flex justify-between items-center mt-6 gap-2 flex-wrap">
        <div className="flex gap-2">
          {/* 🙈 Скрытие перевода */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsTranslationHidden(!isTranslationHidden)}
          >
            <EyeOff className="w-5 h-5" />
          </Button>

          {/* 🔊 Озвучка */}
          <Button variant="ghost" size="icon" onClick={() => speak(word.word)}>
            <Volume2 className="w-5 h-5" />
          </Button>

          {/* 🌐 Смена языка */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEnglishFirst(!isEnglishFirst)}
          >
            <RefreshCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* ✅ Кнопка "выучил" */}
        <Button
          variant="outline"
          className="ml-auto text-sm"
          onClick={() =>
            api.patch(`/words/${word.id}`, { learned: true }).then(onRefresh)
          }
        >
          <Check className="w-4 h-4 mr-2" />
          Выучил
        </Button>
      </div>
    </motion.div>
  )
}