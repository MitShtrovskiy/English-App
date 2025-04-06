import { useState } from 'react'
import { Word } from '@/types'
import { Volume2, EyeOff, RefreshCcw, Check } from 'lucide-react'

interface Props {
  word: Word
}

export default function WordCard({ word }: Props) {
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)

  const textToDisplay = isEnglishFirst ? word.word : word.translation
  const translation = isEnglishFirst ? word.translation : word.word

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.word)
    utterance.lang = 'en-US'
    speechSynthesis.speak(utterance)
  }

  const highlightWordInExample = () => {
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
                <span className="relative z-10 px-2 py-1">{matches[i]}</span>
                <span className="absolute inset-0 rounded-[8px] border border-white/5 bg-white/10 backdrop-blur-[4px] z-20" />
              </>
            )}
          </span>
        )}
      </span>
    ))
  }

  return (
    <div
      className="flex flex-col items-start flex-1 w-full rounded-[32px] overflow-hidden p-0"
      style={{
        background: `linear-gradient(135deg, #${Math.floor(
          Math.random() * 0xffffff,
        ).toString(16)} 0%, #${Math.floor(Math.random() * 0xffffff).toString(16)} 100%)`,
      }}
    >
      {/* 🆎 Слово и транскрипция */}
      <div className="flex p-[24px_20px_20px_20px] items-start gap-[20px] self-stretch">
        <div className="text-[32px] font-light leading-[22px]">{textToDisplay}</div>
        {word.transcription && isEnglishFirst && (
          <div className="text-white/80 text-[16px] font-light leading-[22px]">{word.transcription}</div>
        )}
      </div>

      {/* 💬 Перевод */}
      <div className="px-[20px]">
        <p
          className={`text-white text-[24px] leading-[22px] font-semibold relative ${
            isTranslationHidden ? 'blur-sm' : ''
          }`}
        >
          {isTranslationHidden ? (
            <span className="relative z-10 px-2 py-1">{translation}</span>
          ) : (
            translation
          )}
        </p>
      </div>

      {/* 📘 Пример */}
      <div className="flex px-[20px] flex-col gap-[20px] flex-1 self-stretch pt-[20px] text-white/60 text-[20px] leading-[30px] font-light">
        {highlightWordInExample()}
      </div>

      {/* 🎛️ Контролы */}
      <div className="flex p-[20px] justify-center items-center gap-[6px] self-stretch">
        <div className="flex p-[4px] items-center gap-[4px] rounded-[24px] bg-white/10">
          {/* 👁 Скрыть перевод */}
          <button
            className="flex w-[64px] h-[64px] flex-col justify-center items-center gap-[10px] rounded-[20px] bg-white/10"
            onClick={() => setIsTranslationHidden(!isTranslationHidden)}
          >
            <EyeOff />
          </button>

          {/* 🔊 Звук */}
          <button
            className="flex w-[64px] h-[64px] flex-col justify-center items-center gap-[10px] rounded-[20px] bg-white/10"
            onClick={playAudio}
          >
            <Volume2 />
          </button>

          {/* 🔄 Переключение языка */}
          <button
            className="flex w-[64px] h-[64px] flex-col justify-center items-center gap-[10px] rounded-[20px] bg-white/10"
            onClick={() => setIsEnglishFirst(!isEnglishFirst)}
          >
            <RefreshCcw />
          </button>

          {/* ✅ Кнопка "выучил" */}
          <button className="flex h-[64px] px-[20px] justify-center items-center gap-[10px] rounded-[20px] bg-white/10">
            <Check />
            Выучил
          </button>
        </div>
      </div>
    </div>
  )
}