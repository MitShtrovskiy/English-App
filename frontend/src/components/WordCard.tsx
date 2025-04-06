import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, EyeOff, RefreshCcw, Volume2 } from 'lucide-react'
import { speak } from '../utils/speak'
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
  onRefresh?: () => void
}

export default function WordCard({ word, onRefresh }: WordCardProps) {
  const [isEnglish, setIsEnglish] = useState(true)
  const [showTranslation, setShowTranslation] = useState(false)

  const displayWord = isEnglish ? word.word : word.translation
  const translation = isEnglish ? word.translation : word.word

  const play = () => speak(word.word)

  const exampleWithHighlight = () => {
    const regex = new RegExp(`\\b${word.word}\\b`, 'gi')
    const parts = word.example.split(regex)
    const matches = word.example.match(regex)

    return (
      <>
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {matches?.[i] && (
              <span className="relative font-bold">
                {isEnglish || showTranslation ? (
                  <span>{matches[i]}</span>
                ) : (
                  <>
                    <span className="text-white">{matches[i]}</span>
                    <span className="absolute inset-0 rounded-md border border-white/5 bg-white/10 backdrop-blur-sm" />
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
      className="flex flex-col items-start flex-1 self-stretch mx-4 bg-gradient-to-br from-[#503CCE] to-[#FF57B2] rounded-[32px] overflow-hidden"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      {/* Слово и транскрипция */}
      <div className="flex px-5 pt-6 pb-5 items-start gap-5 self-stretch">
        <div className="text-left">
          <h2 className="text-[32px] text-white font-light leading-[22px]">
            {displayWord}
          </h2>
          {isEnglish && word.transcription && (
            <p className="text-[16px] text-white/80 font-light leading-[22px]">
              {word.transcription}
            </p>
          )}
        </div>
      </div>

      {/* Перевод и пример */}
      <div className="flex flex-col px-5 gap-5 flex-1 self-stretch">
        <p className="text-[24px] text-white font-medium leading-[22px] relative inline-block">
          {!showTranslation ? (
            <span className="text-transparent select-none">
              {translation}
              <span className="absolute top-[-6px] left-[-8px] right-[-8px] bottom-[-6px] rounded-[12px] border border-white/5 bg-white/10 backdrop-blur-xl" />
            </span>
          ) : (
            translation
          )}
        </p>
        <p className="text-[20px] text-white/60 leading-[30px] font-light">
          {exampleWithHighlight()}
        </p>
      </div>

      {/* Контролы */}
      <div className="flex px-5 py-5 justify-center items-center gap-1 self-stretch">
        <div className="flex items-center gap-1 rounded-[24px] bg-white/10 p-1">
          <Button
            variant="ghost"
            className="w-16 h-16 bg-white/10 hover:bg-white/20 rounded-[20px] text-white/60"
            onClick={() => setShowTranslation((prev) => !prev)}
          >
            <EyeOff size={24} />
          </Button>
          <Button
            variant="ghost"
            className="w-16 h-16 bg-white/10 hover:bg-white/20 rounded-[20px] text-white/60"
            onClick={play}
          >
            <Volume2 size={24} />
          </Button>
          <Button
            variant="ghost"
            className="w-16 h-16 bg-white/10 hover:bg-white/20 rounded-[20px] text-white/60"
            onClick={() => setIsEnglish((prev) => !prev)}
          >
            <RefreshCcw size={24} />
          </Button>
          <Button
            variant="ghost"
            className="h-16 px-5 bg-white/10 hover:bg-white/20 rounded-[20px] text-white/60 text-sm font-normal"
          >
            <Check size={24} className="mr-2" />
            Выучил
          </Button>
        </div>
      </div>
    </motion.div>
  )
}