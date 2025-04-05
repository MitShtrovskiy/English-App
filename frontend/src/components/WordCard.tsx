import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Volume2, Repeat, CheckCircle2 } from 'lucide-react'
import { Button } from './ui/button'
import { speak } from '../utils/speak'

interface WordCardProps {
  word: {
    id: number
    word: string
    translation: string
    example: string
    learned: boolean
  }
}

export default function WordCard({ word }: WordCardProps) {
  const [isEnglish, setIsEnglish] = useState(true)
  const [isTranslationShown, setIsTranslationShown] = useState(false)

  const currentWord = isEnglish ? word.word : word.translation
  const currentTranslation = isEnglish ? word.translation : word.word

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish)
    setIsTranslationShown(false) // сбрасываем блюр при смене языка
  }

  const toggleTranslation = () => {
    setIsTranslationShown(!isTranslationShown)
  }

  const playSound = () => {
    speak(word.word)
  }

  // Выделение target-слова в примере
  const exampleParts = word.example.split(new RegExp(`(${word.word})`, 'i'))

  return (
    <motion.div
      className="bg-zinc-900 rounded-3xl shadow-lg p-6 w-full border border-zinc-800 space-y-6 flex flex-col justify-between"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      {/* Слово + Перевод */}
      <div className="space-y-2 text-left">
        <h2 className="text-2xl font-bold leading-tight text-white">
          {currentWord}
        </h2>
        <p
          className={`italic text-sm relative w-fit ${
            isTranslationShown ? 'text-zinc-300' : 'text-zinc-300/40'
          }`}
        >
          {currentTranslation}
          {!isTranslationShown && (
            <span className="absolute inset-0 backdrop-blur-sm bg-black/30 rounded pointer-events-none" />
          )}
        </p>
      </div>

      {/* Пример */}
      <div className="relative text-sm text-zinc-300 leading-snug text-left">
        {exampleParts.map((part, index) => {
          const isTarget = index % 2 === 1

          return (
            <span key={index} className="relative font-normal">
              {isTarget ? (
                <span className="font-semibold relative inline-block">
                  {part}
                  {/* Скрываем слово в примере только если перевод показан и язык русский */}
                  {isEnglish || isTranslationShown ? null : (
                    <span className="absolute inset-0 backdrop-blur-sm bg-black/40 rounded-sm pointer-events-none" />
                  )}
                </span>
              ) : (
                part
              )}
            </span>
          )
        })}
      </div>

      {/* Контролы */}
      <div className="flex justify-between items-center pt-4 flex-wrap gap-3">
        <button
          onClick={toggleTranslation}
          className="flex items-center gap-2 text-sm text-white"
        >
          <Eye size={18} />
        </button>

        <button
          onClick={playSound}
          className="flex items-center gap-2 text-sm text-white"
        >
          <Volume2 size={18} />
        </button>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 text-sm text-white"
        >
          <Repeat size={18} />
        </button>

        <button className="flex items-center gap-2 text-sm text-green-400">
          <CheckCircle2 size={18} />
          Выучил
        </button>
      </div>
    </motion.div>
  )
}