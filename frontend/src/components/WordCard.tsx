import { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, EyeOff, RefreshCcw, Check } from 'lucide-react'
import { speak } from '@/utils/speak'
import { Button } from '@/components/ui/button'

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
                <span className="absolute inset-0 bg-white/10 backdrop-blur-[4px] border border-white/5 rounded-md z-20" />
              </>
            )}
          </span>
        )}
      </span>
    ))
  }

  // 🎨 Градиенты
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
  const gradient = gradients[word.id % gradients.length]

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-start flex-1 w-full h-full rounded-[32px] p-6 bg-gradient-to-br ${gradient} text-white`}
    >
      {/* 🔤 Слово и транскрипция */}
      <div className="flex flex-col gap-2 p-6 w-full">
        <h2 className="text-[32px] font-light leading-[22px]">{textToDisplay}</h2>
        {isEnglishFirst && word.transcription && (
          <p className="text-[16px] font-light text-white/80 leading-[22px]">{word.transcription}</p>
        )}
      </div>

      {/* 🌐 Перевод */}
      <div className="flex flex-col gap-5 px-5 flex-1 w-full">
        <p
          className={`text-[24px] font-medium leading-[22px] relative px-2 py-[6px] rounded-xl border border-white/5 bg-white/10 backdrop-blur-[32px] ${
            isTranslationHidden ? 'blur-sm select-none' : ''
          }`}
        >
          {translation}
        </p>

        {/* 📘 Пример */}
        <p className="text-[20px] font-light text-white/70 leading-[30px]">{renderExample()}</p>
      </div>

      {/* 🎛 Контролы + кнопка выучил */}
      <div className="flex justify-center items-center p-5 gap-2 w-full">
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-[24px]">
          <Button
            onClick={() => setIsTranslationHidden(!isTranslationHidden)}
            className="w-16 h-16 rounded-[20px] bg-white/10"
            size="icon"
          >
            <EyeOff />
          </Button>
          <Button
            onClick={handleSpeak}
            className="w-16 h-16 rounded-[20px] bg-white/10"
            size="icon"
          >
            <Volume2 />
          </Button>
          <Button
            onClick={() => setIsEnglishFirst(!isEnglishFirst)}
            className="w-16 h-16 rounded-[20px] bg-white/10"
            size="icon"
          >
            <RefreshCcw />
          </Button>
          <Button className="h-16 px-6 rounded-[20px] bg-white/10 text-white text-base font-medium flex gap-2">
            <Check className="w-5 h-5" />
            Выучил
          </Button>
        </div>
      </div>
    </motion.div>
  )
}