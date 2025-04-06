import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Volume2, EyeOff, RefreshCcw, Check } from 'lucide-react'
import { speak } from '../utils/speak'
import { Button } from '@/components/ui/button'

interface Word {
  id: number
  word: string
  translation: string
  transcription?: string
  example: string
  learned: boolean
}

interface WordCardProps {
  word: Word
  onMarkAsLearned?: () => void
}

const gradients = [
  'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)',
  'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)',
  'linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)',
  'linear-gradient(135deg, #FAACA8 0%, #DDD6F3 100%)',
  'linear-gradient(135deg, #FF8177 0%, #FF867A 100%)',
  'linear-gradient(135deg, #4AC29A 0%, #BDFFF3 100%)',
  'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
  'linear-gradient(135deg, #FF6FD8 0%, #3813C2 100%)',
  'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
  'linear-gradient(135deg, #30E8BF 0%, #FF8235 100%)',
]

export default function WordCard({ word, onMarkAsLearned }: WordCardProps) {
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)

  const gradient = useMemo(() => {
    const index = word.id % gradients.length
    return gradients[index]
  }, [word.id])

  const textToDisplay = isEnglishFirst ? word.word : word.translation
  const translation = isEnglishFirst ? word.translation : word.word

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
              <span className="relative font-semibold">
                {isEnglishFirst || !isTranslationHidden ? (
                  <span className="font-bold">{matches[i]}</span>
                ) : (
                  <span className="relative inline-block px-2 py-1">
                    <span className="text-white font-bold relative z-10">{matches[i]}</span>
                    <span className="absolute inset-0 rounded-md border border-white/5 bg-white/10 backdrop-blur-sm" />
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
      className="flex flex-col items-start flex-1 w-full h-full rounded-[32px] overflow-hidden px-5 pt-[54px]"
      style={{ background: gradient }}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4 }}
    >
      {/* Блок с текстом */}
      <div className="flex flex-col gap-[20px] w-full px-5">
        <div className="flex flex-col gap-2">
          <div className="text-white text-[32px] font-light leading-[22px]">{textToDisplay}</div>
          {isEnglishFirst && word.transcription && (
            <div className="text-white/80 text-[16px] font-light leading-[22px] mt-2">
              {word.transcription}
            </div>
          )}
        </div>

        <div className="relative text-[24px] font-medium leading-[22px] text-white">
          <span
            className={`italic relative inline-block transition duration-300 ${
              isTranslationHidden ? 'blur-[4px] select-none' : ''
            }`}
          >
            {translation}
            {isTranslationHidden && (
              <span className="absolute inset-[-6px] px-2 py-1 rounded-[12px] border border-white/5 bg-white/10 backdrop-blur-2xl z-10" />
            )}
          </span>
        </div>

        <div className="text-white/60 text-[20px] leading-[30px] font-light">
          {highlightWordInExample()}
        </div>
      </div>

      {/* Контролы */}
      <div className="mt-auto w-full px-5 pt-10">
        <div className="flex justify-center items-center gap-2 p-4 bg-white/10 rounded-[24px]">
          <button
            className="w-16 h-16 flex justify-center items-center rounded-[20px] bg-white/10 hover:bg-white/20"
            onClick={() => setIsTranslationHidden(!isTranslationHidden)}
          >
            <EyeOff className="w-6 h-6 text-white/60" />
          </button>
          <button
            className="w-16 h-16 flex justify-center items-center rounded-[20px] bg-white/10 hover:bg-white/20"
            onClick={playAudio}
          >
            <Volume2 className="w-6 h-6 text-white/60" />
          </button>
          <button
            className="w-16 h-16 flex justify-center items-center rounded-[20px] bg-white/10 hover:bg-white/20"
            onClick={() => setIsEnglishFirst(!isEnglishFirst)}
          >
            <RefreshCcw className="w-6 h-6 text-white/60" />
          </button>
          <button
            className="flex items-center gap-2 px-6 h-16 rounded-[20px] bg-white/10 hover:bg-white/20 text-white text-sm font-medium"
            onClick={onMarkAsLearned}
          >
            <Check className="w-5 h-5" />
            Выучил
          </button>
        </div>
      </div>
    </motion.div>
  )
}