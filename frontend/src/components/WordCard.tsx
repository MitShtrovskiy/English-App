import { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, EyeOff, RefreshCcw, Check } from 'lucide-react'
import { speak } from '../utils/speak'

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

const gradients = [
  'from-[#FF7E5F] to-[#FEB47B]',
  'from-[#6A82FB] to-[#FC5C7D]',
  'from-[#43C6AC] to-[#F8FFAE]',
  'from-[#FF9A8B] to-[#FF6A88]',
  'from-[#36D1DC] to-[#5B86E5]',
  'from-[#B2FEFA] to-[#0ED2F7]',
  'from-[#FCE38A] to-[#F38181]',
  'from-[#DCE35B] to-[#45B649]',
  'from-[#C6FFDD] to-[#FBD786]',
  'from-[#3CA55C] to-[#B5AC49]',
]

const getRandomGradient = () =>
  gradients[Math.floor(Math.random() * gradients.length)]

export default function WordCard({ word, onMarkAsLearned }: WordCardProps) {
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)

  const textToDisplay = isEnglishFirst ? word.word : word.translation
  const translation = isEnglishFirst ? word.translation : word.word
  const gradient = getRandomGradient()

  const playAudio = () => speak(word.word)

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
                  <span className="relative inline-block">
                    <span className="text-white">{matches[i]}</span>
                    <span className="absolute inset-0 rounded-[8px] border border-white/5 bg-white/10 backdrop-blur-sm" />
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
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -60, opacity: 0 }}
      transition={{ duration: 0.3 }}
      layout
      className={`flex flex-col items-start flex-1 self-stretch rounded-2xl shadow-lg bg-gradient-to-br ${gradient} p-0 overflow-hidden mx-4`}
    >
      {/* Слово + транскрипция */}
      <div className="flex flex-col gap-2 px-5 pt-6 pb-4 w-full">
        <h2 className="text-white text-[32px] font-light leading-[22px]">
          {textToDisplay}
        </h2>
        {word.transcription && isEnglishFirst && (
          <p className="text-sm text-white/80 leading-[22px]">{word.transcription}</p>
        )}
      </div>

      {/* Перевод + пример */}
      <div className="flex flex-col gap-5 px-5 flex-1 self-stretch">
        <p className="relative text-white text-[24px] font-medium leading-[22px]">
          <span
            className={`transition-all duration-300 relative ${
              isTranslationHidden ? 'select-none text-transparent'
                : 'text-white'
            }`}
          >
            {translation}
            {isTranslationHidden && (
              <span className="absolute inset-[-6px] px-2 py-[6px] rounded-[12px] border border-white/5 bg-white/10 backdrop-blur-[32px]" />
            )}
          </span>
        </p>

        <p className="text-[20px] text-white/60 font-light leading-[30px]">
          {highlightWordInExample()}
        </p>
      </div>

      {/* Контролы */}
      <div className="flex px-5 pt-6 pb-8 justify-center items-center gap-2 self-stretch">
        <div className="flex p-1 items-center gap-1 rounded-[24px] bg-white/10 w-full justify-between">
          <button
            onClick={() => setIsTranslationHidden(!isTranslationHidden)}
            className="w-16 h-16 flex items-center justify-center rounded-[20px] bg-white/10 active:bg-white/20"
          >
            <EyeOff className="w-6 h-6 text-white/60" />
          </button>
          <button
            onClick={playAudio}
            className="w-16 h-16 flex items-center justify-center rounded-[20px] bg-white/10 active:bg-white/20"
          >
            <Volume2 className="w-6 h-6 text-white/60" />
          </button>
          <button
            onClick={() => setIsEnglishFirst(!isEnglishFirst)}
            className="w-16 h-16 flex items-center justify-center rounded-[20px] bg-white/10 active:bg-white/20"
          >
            <RefreshCcw className="w-6 h-6 text-white/60" />
          </button>
          <button
            onClick={onMarkAsLearned}
            className="h-16 px-5 flex justify-center items-center gap-2 rounded-[20px] bg-white/10 text-white text-sm active:bg-white/20"
          >
            <Check className="w-5 h-5 text-white/60" />
            <span className="text-white/60">Выучил</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}