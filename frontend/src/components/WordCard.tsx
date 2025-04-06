// src/components/WordCard.tsx

import { useEffect, useState } from 'react'
import { Word } from '../types'
import { volume, eye, eyeOff, shuffle, check } from 'lucide-react'
import { playSound } from '../utils/playSound'
import { cn } from '../utils/cn'

export default function WordCard({
  word,
  isEnglishFirst,
  isTranslationHidden,
  onToggleLanguage,
  onToggleTranslation,
  onMarkLearned,
}: {
  word: Word
  isEnglishFirst: boolean
  isTranslationHidden: boolean
  onToggleLanguage: () => void
  onToggleTranslation: () => void
  onMarkLearned: () => void
}) {
  const [gradient, setGradient] = useState<string>('')

  // 🌈 Случайный градиент
  useEffect(() => {
    const gradients = [
      'linear-gradient(180deg, #FF7E5F, #FEB47B)',
      'linear-gradient(180deg, #6A82FB, #FC5C7D)',
      'linear-gradient(180deg, #43CEA2, #185A9D)',
      // ...добавь ещё 40
    ]
    setGradient(gradients[Math.floor(Math.random() * gradients.length)])
  }, [word.id])

  const mainWord = isEnglishFirst ? word.english : word.russian
  const translation = isEnglishFirst ? word.russian : word.english

  return (
    <div
      className="w-[440px] h-[956px] pt-[54px] flex flex-col items-start shrink-0"
      style={{ background: gradient, borderRadius: 32 }}
    >
      {/* 🔠 Слово и транскрипция */}
      <div className="flex px-5 pt-6 pb-5 gap-5 self-stretch">
        <div className="text-white text-[32px] font-light leading-[22px] text-center font-['SF Pro']">
          {mainWord}
        </div>
        <div className="text-white/80 text-[16px] leading-[22px] text-center font-['SF Pro Text']">
          {word.transcription}
        </div>
      </div>

      {/* 🌐 Перевод */}
      <div className="flex px-5 flex-col items-start gap-5 flex-1 self-stretch">
        <div className="relative text-white text-[24px] font-medium leading-[22px] font-['SF Pro']">
          {isTranslationHidden ? (
            <div className="px-2 py-1 rounded-[12px] border border-white/5 bg-[#D9D9D914] backdrop-blur-[32px]">
              {translation}
            </div>
          ) : (
            translation
          )}
        </div>

        {/* 📖 Пример */}
        <div className="text-white/60 text-[20px] font-light leading-[30px] font-['SF Pro']">
          {word.example.replace(mainWord, (match) =>
            isTranslationHidden
              ? `<span class="font-bold relative z-10">${match}</span><span class="absolute inset-0 bg-[#D9D9D914] backdrop-blur-sm rounded-[8px] z-20"></span>`
              : `<span class="font-bold">${match}</span>`
          )}
        </div>
      </div>

      {/* 🎛 Контролы */}
      <div className="flex p-5 justify-center items-center gap-[6px] self-stretch">
        <div className="flex p-1 items-center gap-1 rounded-[24px] bg-white/10">
          {/* Озвучка */}
          <button
            className="w-[64px] h-[64px] flex justify-center items-center rounded-[20px] bg-white/10"
            onClick={() => playSound(word.english)}
          >
            <volume />
          </button>

          {/* Переключение языка */}
          <button
            className="w-[64px] h-[64px] flex justify-center items-center rounded-[20px] bg-white/10"
            onClick={onToggleLanguage}
          >
            <shuffle />
          </button>

          {/* Скрытие перевода */}
          <button
            className="w-[64px] h-[64px] flex justify-center items-center rounded-[20px] bg-white/10"
            onClick={onToggleTranslation}
          >
            {isTranslationHidden ? <eyeOff /> : <eye />}
          </button>

          {/* ✅ Выучено */}
          <button
            className="flex h-[64px] px-5 justify-center items-center gap-2 rounded-[20px] bg-white/10 text-white"
            onClick={onMarkLearned}
          >
            <check size={24} />
            <span className="text-base">Выучил</span>
          </button>
        </div>
      </div>
    </div>
  )
}