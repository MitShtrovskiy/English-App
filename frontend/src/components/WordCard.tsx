import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Volume2, EyeOff, RefreshCcw, Check } from 'lucide-react'
import { speak } from '../utils/speak'
import { getRandomGradient } from '../utils/gradients'

interface WordCardProps {
  word: {
    id: number
    word: string
    translation: string
    example: string
    transcription?: string
    learned: boolean
  }
  direction: 'left' | 'right'
}

export default function WordCard({ word, direction }: WordCardProps) {
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)
  const [bgGradient, setBgGradient] = useState(getRandomGradient())

  useEffect(() => {
    setBgGradient(getRandomGradient())
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
              isEnglishFirst || !isTranslationHidden ? (
                <span className="font-bold text-white">{matches[i]}</span>
              ) : (
                <span className="relative font-bold text-white px-2">
                  {matches[i]}
                  <span className="absolute inset-[-6px] bg-white/10 backdrop-blur-[4px] rounded-[8px] border border-white/5" />
                </span>
              )
            )}
          </span>
        ))}
      </>
    )
  }

  return (
    <motion.div
      className="flex flex-col items-start flex-1 w-full px-0"
      initial={{ x: direction === 'right' ? 100 : -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction === 'right' ? -100 : 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: bgGradient,
      }}
    >
      {/* Слово + транскрипция */}
      <div className="flex flex-col gap-2 px-5 pt-6 pb-5 w-full">
        <h2 className="text-white text-[32px] leading-[22px] font-light">
          {isTranslationHidden && !isEnglishFirst ? (
            <span className="relative px-2">
              {textToDisplay}
              <span className="absolute inset-[-6px] bg-white/10 backdrop-blur-[32px] rounded-[12px] border border-white/5" />
            </span>
          ) : (
            textToDisplay
          )}
        </h2>
        {word.transcription && isEnglishFirst && (
          <p className="text-white/80 text-[16px] leading-[22px] font-light mt-[8px]">
            {word.transcription}
          </p>
        )}
      </div>

      {/* Перевод + Пример */}
      <div className="flex flex-col px-5 gap-5 flex-1 w-full">
        <p className={`text-[24px] leading-[22px] text-white font-medium italic relative inline-block transition-all ${isTranslationHidden ? 'blur-sm select-none' : ''}`}>
          {translation}
        </p>
        <p className="text-[20px] text-white/60 leading-[30px] font-light">
          {highlightWordInExample()}
        </p>
      </div>

      {/* Контролы */}
      <div className="flex justify-center items-center gap-1 w-full px-5 py-5">
        <div className="flex gap-1 p-1 rounded-[24px] bg-white/10">
          <button
            onClick={() => setIsTranslationHidden(!isTranslationHidden)}
            className="w-[64px] h-[64px] flex items-center justify-center rounded-[20px] bg-white/10 active:bg-white/20"
          >
            <EyeOff size={24} color="#FFFFFF99" />
          </button>
          <button
            onClick={() => speak(word.word)}
            className="w-[64px] h-[64px] flex items-center justify-center rounded-[20px] bg-white/10 active:bg-white/20"
          >
            <Volume2 size={24} color="#FFFFFF99" />
          </button>
          <button
            onClick={() => setIsEnglishFirst(!isEnglishFirst)}
            className="w-[64px] h-[64px] flex items-center justify-center rounded-[20px] bg-white/10 active:bg-white/20"
          >
            <RefreshCcw size={24} color="#FFFFFF99" />
          </button>
          <button
            className="h-[64px] px-5 flex items-center justify-center gap-2 rounded-[20px] bg-white/10 active:bg-white/20 text-white/90 text-sm"
          >
            <Check size={24} color="#FFFFFF99" />
            Выучил
          </button>
        </div>
      </div>
    </motion.div>
  )
}