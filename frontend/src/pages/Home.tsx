import { useState } from 'react'
import { Volume2, Eye, Repeat2, Check } from 'lucide-react'
import { speak } from '../utils/speak'


interface WordCardProps {
  word: {
    id: number
    word: string
    transcription: string
    translation: string
    example: string
    learned: boolean
  }
}

export default function WordCard({ word }: WordCardProps) {
  const [isEnglish, setIsEnglish] = useState(true)
  const [showTranslation, setShowTranslation] = useState(false)

  const displayWord = isEnglish ? word.word : word.translation
  const displayTranslation = isEnglish ? word.translation : word.word
  const wordInExample = word.word

  const exampleWithHighlight = word.example.split(new RegExp(`(${wordInExample})`, 'gi')).map((part, i) => {
    const isTarget = part.toLowerCase() === wordInExample.toLowerCase()
    return (
      <span
        key={i}
        className={cn(
          'font-semibold transition-all duration-300',
          !isEnglish && !showTranslation && isTarget ? 'blur-sm opacity-60' : ''
        )}
      >
        {part}
      </span>
    )
  })

  return (
    <div className="relative flex flex-col justify-between h-full p-6 rounded-3xl text-white overflow-hidden bg-gradient-to-br from-[#2C2C2C] to-[#1A1A1A] border border-white/10 shadow-xl">
      {/* Верх */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold">{displayWord}</h2>
            <p className="text-muted-foreground text-sm">{word.transcription}</p>
          </div>
          <button
            onClick={() => speak(word.word)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <Volume2 size={20} />
          </button>
        </div>

        {/* Перевод */}
        <p
          className={cn(
            'italic text-lg font-medium transition-all duration-300',
            !showTranslation ? 'blur-sm opacity-60' : ''
          )}
        >
          {displayTranslation}
        </p>

        {/* Пример */}
        <p className="text-sm text-zinc-300">{exampleWithHighlight}</p>
      </div>

      {/* Контролы */}
      <div className="mt-6 flex justify-between items-center gap-3">
        <button
          onClick={() => setIsEnglish(!isEnglish)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <Repeat2 size={20} />
        </button>
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <Eye size={20} />
        </button>
        <button className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 rounded-full px-3 py-2 transition">
          <Check size={16} /> Выучил
        </button>
      </div>
    </div>
  )
}