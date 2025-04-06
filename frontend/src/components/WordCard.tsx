import { useState } from 'react'
import { Volume2, EyeOff, RefreshCcw, Check } from 'lucide-react'
import { speak } from '../utils/speak'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface WordCardProps {
  word: {
    id: number
    word: string
    transcription?: string
    translation: string
    example: string
    learned: boolean
  }
  isEnglishFirst: boolean
  isTranslationHidden: boolean
  onToggleLanguage: () => void
  onToggleTranslation: () => void
  onMarkAsLearned: () => void
}

export default function WordCard({
  word,
  isEnglishFirst,
  isTranslationHidden,
  onToggleLanguage,
  onToggleTranslation,
  onMarkAsLearned,
}: WordCardProps) {
  const displayedWord = isEnglishFirst ? word.word : word.translation
  const translation = isEnglishFirst ? word.translation : word.word

  // 🎙️ Озвучка
  const handleSpeak = () => {
    speak(word.word)
  }

  // ✨ Пример с выделением слова и светлой плашкой блюра
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
      className="rounded-3xl p-6 w-full h-full flex flex-col justify-between overflow-hidden text-left relative"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-2">
        {/* 🧠 Слово и транскрипция */}
        <h2 className="text-4xl font-bold text-white">{displayedWord}</h2>
        {word.transcription && isEnglishFirst && (
          <p className="text-white text-base">{word.transcription}</p> // транскрипция теперь белая
        )}

        {/* 🫣 Перевод с возможностью скрытия */}
        <p
          className={`text-base italic relative transition duration-300 inline-block ${
            isTranslationHidden ? 'blur-sm select-none' : ''
          }`}
        >
          {translation}
        </p>

        {/* 📝 Пример */}
        <p className="mt-4 text-zinc-100 text-base leading-relaxed">{renderExample()}</p>
      </div>

      {/* 🧩 Контролы */}
      <div className="flex items-center gap-3 flex-wrap pt-6">
        <Button onClick={onToggleTranslation} variant="ghost" size="lg" className="w-12 h-12">
          <EyeOff className="w-6 h-6" />
        </Button>
        <Button onClick={handleSpeak} variant="ghost" size="lg" className="w-12 h-12">
          <Volume2 className="w-6 h-6" />
        </Button>
        <Button onClick={onToggleLanguage} variant="ghost" size="lg" className="w-12 h-12">
          <RefreshCcw className="w-6 h-6" />
        </Button>

        {/* ✅ Выучено */}
        <Button onClick={onMarkAsLearned} variant="outline" className="ml-auto text-sm px-4 py-3 rounded-xl">
          <Check className="w-4 h-4 mr-2" />
          Выучил
        </Button>
      </div>
    </motion.div>
  )
}