import { useEffect, useState } from 'react'
import { Volume2, EyeOff, RefreshCcw, Check } from 'lucide-react'
import { speak } from '../utils/speak'
import { motion } from 'framer-motion'
import { getRandomGradient } from '../utils/gradients'

interface WordCardProps {
  word: {
    id: number
    word: string
    translation: string
    transcription?: string
    example: string
    learned: boolean
  }
  onMarkAsLearned?: () => void
  index: number
  currentIndex: number
}

export default function WordCard({
  word,
  onMarkAsLearned,
  index,
  currentIndex,
}: WordCardProps) {
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)
  const [bgGradient, setBgGradient] = useState(getRandomGradient())

  // Меняем градиент только при смене карточки
  useEffect(() => {
    if (index === currentIndex) {
      setBgGradient(getRandomGradient())
    }
  }, [index, currentIndex])

  const textToDisplay = isEnglishFirst ? word.word : word.translation
  const translation = isEnglishFirst ? word.translation : word.word

  const playAudio = () => speak(word.word)

  // 🔤 Отображение слова в примере с блюром при нужных условиях
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
                  <span className="relative inline-block px-2">
                    <span className="opacity-0">{matches[i]}</span>
                    <span className="absolute inset-0 rounded-[8px] border border-white/5 bg-white/10 backdrop-blur-[4px]" />
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
      className="flex flex-col w-full h-full rounded-[32px] overflow-hidden px-0"
      style={{
        background: bgGradient,
      }}
      key={word.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
    >
      {/* 🧠 Блок со словом и транскрипцией */}
      <div className="flex flex-col px-5 pt-6 gap-2">
        <h2 className="text-white text-[32px] font-light leading-[22px]">
          {textToDisplay}
        </h2>
        {isEnglishFirst && word.transcription && (
          <p className="text-[16px] font-light text-white/80 leading-[22px] mt-2">
            {word.transcription}
          </p>
        )}
      </div>

      {/* 🌐 Перевод (с блюром по умолчанию) */}
      <div className="px-5 pt-6">
        <p
          className={`text-[24px] font-medium leading-[22px] text-white relative inline-block transition duration-300 ${
            isTranslationHidden ? 'blur-sm select-none' : ''
          }`}
        >
          {translation}
        </p>
      </div>

      {/* 📘 Пример использования слова */}
      <div className="flex flex-col gap-5 px-5 pt-6 flex-1 justify-center">
        <p className="text-[20px] font-light leading-[30px] text-white/60">
          {renderExample()}
        </p>
      </div>

      {/* 🎛️ Контролы (Sound, Eye, Toggle, Выучил) */}
      <div className="flex justify-center items-center gap-[6px] px-5 pb-6">
        <div className="flex items-center gap-[4px] p-[4px] rounded-[24px] bg-white/10">
          <button
            onClick={() => setIsTranslationHidden(!isTranslationHidden)}
            className={`w-[64px] h-[64px] flex justify-center items-center rounded-[20px] ${
              isTranslationHidden ? 'bg-white/12' : 'bg-white/24'
            }`}
          >
            <EyeOff size={24} color="#ffffff99" />
          </button>
          <button
            onClick={playAudio}
            className="w-[64px] h-[64px] flex justify-center items-center rounded-[20px] bg-white/12"
          >
            <Volume2 size={24} color="#ffffff99" />
          </button>
          <button
            onClick={() => setIsEnglishFirst(!isEnglishFirst)}
            className="w-[64px] h-[64px] flex justify-center items-center rounded-[20px] bg-white/12"
          >
            <RefreshCcw size={24} color="#ffffff99" />
          </button>
          <button
            onClick={onMarkAsLearned}
            className="h-[64px] px-6 flex justify-center items-center gap-[10px] rounded-[20px] bg-white/12 text-white text-sm font-medium"
          >
            <Check size={24} color="#ffffff99" />
            Выучил
          </button>
        </div>
      </div>
    </motion.div>
  )
}