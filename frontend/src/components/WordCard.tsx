import { useEffect, useMemo, useState } from 'react'
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
  onMarkAsLearned?: () => void
}

export default function WordCard({ word, onMarkAsLearned }: WordCardProps) {
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)

  // ✅ Сохраняем градиент один раз при маунте карточки
  const gradient = useMemo(() => getRandomGradient(), [])

  const displayedWord = isEnglishFirst ? word.word : word.translation
  const translation = isEnglishFirst ? word.translation : word.word

  const playAudio = () => {
    speak(word.word)
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
              <span className="relative font-bold text-white">
                {isEnglishFirst || !isTranslationHidden ? (
                  matches[i]
                ) : (
                  <>
                    <span className="relative z-10">{matches[i]}</span>
                    <span
                      className="absolute inset-0 z-20 rounded-md"
                      style={{
                        background: 'rgba(217, 217, 217, 0.08)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        borderRadius: '8px',
                      }}
                    />
                  </>
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
      className="flex flex-col items-start flex-1 w-full h-full rounded-[32px] p-0 overflow-hidden"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      style={{ background: gradient }}
    >
      {/* Блок слова и транскрипции */}
      <div className="flex flex-col gap-2 p-[32px_20px_20px_20px] items-start w-full">
        <h2 className="text-white text-[32px] leading-[22px] font-light">
          {displayedWord}
        </h2>
        {isEnglishFirst && word.transcription && (
          <p className="text-[16px] text-white/80 leading-[22px] font-light mt-2">
            {word.transcription}
          </p>
        )}
      </div>

      {/* Перевод + Пример */}
      <div className="flex flex-col gap-5 px-5 w-full flex-1">
        <p className="text-[24px] text-white font-medium leading-[22px] relative inline-block">
          <span
            className={`transition-all duration-300 ${
              isTranslationHidden && 'text-transparent'
            }`}
          >
            {translation}
          </span>
          {isTranslationHidden && (
            <span
              className="absolute top-[-6px] bottom-[-6px] left-[-8px] right-[-8px] z-10 rounded-[12px]"
              style={{
                background: 'rgba(217, 217, 217, 0.08)',
                backdropFilter: 'blur(32px)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            />
          )}
        </p>
        <p className="text-[20px] font-light text-white/60 leading-[30px] relative z-0">
          {highlightWordInExample()}
        </p>
      </div>

      {/* Блок контролов */}
      <div className="flex w-full justify-center items-center px-5 pt-5 pb-8">
        <div className="flex items-center gap-1 p-1 rounded-[24px] bg-white/10">
          <button
            onClick={() => setIsTranslationHidden((prev) => !prev)}
            className="w-[64px] h-[64px] flex items-center justify-center rounded-[20px] bg-white/20 active:bg-white/30"
          >
            <EyeOff className="w-6 h-6 text-white/60" />
          </button>
          <button
            onClick={playAudio}
            className="w-[64px] h-[64px] flex items-center justify-center rounded-[20px] bg-white/20 active:bg-white/30"
          >
            <Volume2 className="w-6 h-6 text-white/60" />
          </button>
          <button
            onClick={() => setIsEnglishFirst((prev) => !prev)}
            className="w-[64px] h-[64px] flex items-center justify-center rounded-[20px] bg-white/20 active:bg-white/30"
          >
            <RefreshCcw className="w-6 h-6 text-white/60" />
          </button>
          <button
            onClick={onMarkAsLearned}
            className="h-[64px] px-5 flex items-center gap-2 rounded-[20px] bg-white/20 active:bg-white/30 text-white text-sm font-medium"
          >
            <Check className="w-5 h-5 text-white/60" />
            Выучил
          </button>
        </div>
      </div>
    </motion.div>
  )
}