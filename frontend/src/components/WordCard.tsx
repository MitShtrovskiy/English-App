// WordCard.tsx

import { useState, useMemo } from 'react'
import { Volume2, EyeOff, RefreshCcw, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { speak } from '../utils/speak'

const gradients = [
  'from-pink-500 to-yellow-500',
  'from-indigo-500 to-purple-500',
  'from-teal-500 to-lime-500',
  'from-orange-400 to-red-500',
  'from-blue-500 to-green-500',
  // Добавь ещё до 40 градиентов по вкусу
]

export default function WordCard({ word }: { word: any }) {
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)

  const gradient = useMemo(
    () => gradients[Math.floor(Math.random() * gradients.length)],
    []
  )

  const text = isEnglishFirst ? word.word : word.translation
  const translation = isEnglishFirst ? word.translation : word.word

  const highlightExample = () => {
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
                <span className="absolute inset-0 bg-white/10 backdrop-blur-[4px] rounded-[8px] border border-white/5 z-20" />
              </>
            )}
          </span>
        )}
      </span>
    ))
  }

  return (
    <motion.div
      className={`flex flex-col items-start flex-1 w-full rounded-[32px] p-0 overflow-hidden bg-gradient-to-br ${gradient} relative`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      layout
    >
      {/* 🔤 Блок слова + транскрипции */}
      <div className="flex p-[24px_20px_20px_20px] items-start gap-5 w-full">
        <div>
          <h2 className="text-white text-[32px] font-light leading-[22px]">{text}</h2>
          {isEnglishFirst && word.transcription && (
            <p className="text-white/80 text-[16px] font-light leading-[22px]">
              {word.transcription}
            </p>
          )}
        </div>
      </div>

      {/* 🔁 Блок перевода + примера */}
      <div className="flex flex-col px-5 gap-5 flex-1 w-full">
        <p
          className={`text-white text-[24px] font-medium leading-[22px] transition ${
            isTranslationHidden ? 'blur-sm select-none' : ''
          } bg-white/10 backdrop-blur-[20px] rounded-md px-2 py-1`}
        >
          {translation}
        </p>
        <p className="text-white/60 text-[20px] font-light leading-[30px]">
          {highlightExample()}
        </p>
      </div>

      {/* 🎛️ Контролы */}
      <div className="flex px-5 py-5 justify-center items-center gap-[6px] w-full">
        <div className="flex p-1 items-center gap-1 rounded-[24px] bg-white/10">
          <button
            className="flex w-[64px] h-[64px] justify-center items-center rounded-[20px] bg-white/10"
            onClick={() => setIsTranslationHidden((v) => !v)}
          >
            <EyeOff className="w-5 h-5" />
          </button>
          <button
            className="flex w-[64px] h-[64px] justify-center items-center rounded-[20px] bg-white/10"
            onClick={() => speak(word.word)}
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <button
            className="flex w-[64px] h-[64px] justify-center items-center rounded-[20px] bg-white/10"
            onClick={() => setIsEnglishFirst((v) => !v)}
          >
            <RefreshCcw className="w-5 h-5" />
          </button>

          {/* ✅ Кнопка "Выучил" */}
          <button className="flex h-[64px] px-5 justify-center items-center gap-[10px] rounded-[20px] bg-white/10 ml-2">
            <Check className="w-5 h-5" />
            <span className="text-white text-sm">Выучил</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}