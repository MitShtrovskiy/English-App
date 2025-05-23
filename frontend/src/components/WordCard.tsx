import { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, EyeOff, RefreshCcw, Check } from 'lucide-react'
import { speak } from '../utils/speak'
import { cn } from '../utils/cn'

interface Word {
  id: number
  word: string
  translation: string
  example: string
  transcription?: string
  learned: boolean
}

interface WordCardProps {
  word: Word
  gradient: string
  onMarkAsLearned: () => void
}

export default function WordCard({ word, gradient, onMarkAsLearned }: WordCardProps) {
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)

  const mainText = isEnglishFirst ? word.word : word.translation
  const translationText = isEnglishFirst ? word.translation : word.word

  const playAudio = () => speak(word.word)

  // 🔍 Пример с выделением и блюром
  const renderExample = () => {
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
                  <span className="relative inline-block">
                    <span className="opacity-0">{matches[i]}</span>
                    <span className="absolute inset-0 -m-1 rounded-[8px] border border-white/5 bg-white/10 backdrop-blur-[4px]" />
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
      key={word.id}
      layout
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-start flex-1 w-full h-full rounded-[32px] overflow-hidden"
      style={{ background: gradient }}
    >
      {/* 🔠 Блок слова и транскрипции */}
      <div className="flex flex-col px-5 pt-8 pb-6 gap-2 w-full" style={{ height: '108px' }}>
        <h2 className="text-white text-[32px] font-light leading-[22px]">{mainText}</h2>
        {word.transcription && isEnglishFirst && (
          <p className="text-white/80 text-[16px] font-light leading-[22px] mt-2">{word.transcription}</p>
        )}
      </div>

      {/* 📘 Перевод и пример */}
      <div className="flex flex-col gap-5 px-5 py-5 flex-1 w-full">
        {/* Перевод */}
        <div className="relative inline-block" style={{ height: '40px' }}>
          {isTranslationHidden ? (
            <span className="relative inline-block">
              <span className="opacity-0 text-[24px] font-medium leading-[30px] text-white">
                {translationText}
              </span>
              <span className="absolute inset-0 -m-1 rounded-[8px] border border-white/5 bg-white/10 backdrop-blur-[2px]" />
            </span>
          ) : (
            <p className="text-white text-[24px] font-medium leading-[22px]">{translationText}</p>
          )}
        </div>

        {/* Пример */}
        <p className="text-white/60 text-[20px] font-light leading-[30px]">
          {renderExample()}
        </p>
      </div>

      {/* 🎛 Контролы */}
      <div className="flex justify-center items-center w-full px-5 py-5 pb-10">
        <div className="flex items-center gap-1 rounded-[24px] bg-white/10 p-1">
          {/* 👁 HideTranslation */}
          <button
            onClick={() => setIsTranslationHidden(!isTranslationHidden)}
            className="w-16 h-16 flex justify-center items-center rounded-[20px] bg-white/10 active:bg-white/20"
          >
            <EyeOff className="w-6 h-6 text-white/60" />
          </button>

          {/* 🔊 Sound */}
          <button
            onClick={playAudio}
            className="w-16 h-16 flex justify-center items-center rounded-[20px] bg-white/10 active:bg-white/20"
          >
            <Volume2 className="w-6 h-6 text-white/60" />
          </button>

          {/* 🔁 LanguageToggle */}
          <button
            onClick={() => setIsEnglishFirst(!isEnglishFirst)}
            className="w-16 h-16 flex justify-center items-center rounded-[20px] bg-white/10 active:bg-white/20"
          >
            <RefreshCcw className="w-6 h-6 text-white/60" />
          </button>

          {/* ✅ Выучил */}
          <button
            onClick={onMarkAsLearned}
            className="h-16 px-5 flex justify-center items-center gap-2 rounded-[20px] bg-white/10 text-white active:bg-white/20"
          >
            <Check className="w-5 h-5 text-white/60" />
            <span className="text-sm font-medium text-white/60">Выучил</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}