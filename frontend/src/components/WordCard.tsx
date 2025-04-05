import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { EyeOff, RefreshCcw, Volume2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const gradients = [
  'from-pink-500 via-red-500 to-yellow-500',
  'from-indigo-500 via-purple-500 to-pink-500',
  'from-green-400 via-blue-500 to-purple-600',
  'from-yellow-400 via-red-500 to-pink-500',
  'from-cyan-500 via-blue-500 to-indigo-500',
]

function getRandomGradient() {
  return gradients[Math.floor(Math.random() * gradients.length)]
}

interface WordCardProps {
  word: {
    id: number
    word: string
    translation: string
    example: string
    transcription?: string
    learned: boolean
  }
}

export default function WordCard({ word }: WordCardProps) {
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)

  const textToDisplay = isEnglishFirst ? word.word : word.translation
  const translation = isEnglishFirst ? word.translation : word.word

  const gradient = useMemo(() => getRandomGradient(), [])

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(word.word)
    utterance.lang = 'en-US'
    speechSynthesis.speak(utterance)
  }

  const highlightExample = () => {
    const regex = new RegExp(`\\b${word.word}\\b`, 'gi')
    const parts = word.example.split(regex)
    const matches = word.example.match(regex)

    return (
      <>
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {matches && matches[i] && (
              <span className="relative font-medium">
                {isEnglishFirst || !isTranslationHidden ? (
                  <span className="text-white font-bold">{matches[i]}</span>
                ) : (
                  <span className="relative text-white font-bold">
                    {matches[i]}
                    <span className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-sm" />
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
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`w-full rounded-[30px] p-6 text-white flex flex-col justify-between bg-gradient-to-br ${gradient} relative shadow-2xl backdrop-blur-xl min-h-[65vh]`}
      style={{ backdropFilter: 'blur(20px)' }}
    >
      <div className="space-y-1 text-left">
        <h2 className="text-3xl font-bold leading-tight">{textToDisplay}</h2>
        {isEnglishFirst && word.transcription && (
          <p className="text-sm text-white/70">{word.transcription}</p>
        )}
      </div>

      <div className="mt-4">
        <p
          className={`italic text-white/80 text-sm inline-block transition duration-300 ${
            isTranslationHidden ? 'blur-sm select-none' : ''
          }`}
        >
          {translation}
        </p>
      </div>

      <p className="text-sm text-white/90 leading-relaxed mt-6">
        {highlightExample()}
      </p>

      <div className="flex items-center justify-between gap-2 mt-6 flex-wrap">
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setIsTranslationHidden(!isTranslationHidden)} size="icon">
            <EyeOff className="w-5 h-5" />
          </Button>
          <Button variant="ghost" onClick={speak} size="icon">
            <Volume2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" onClick={() => setIsEnglishFirst(!isEnglishFirst)} size="icon">
            <RefreshCcw className="w-5 h-5" />
          </Button>
        </div>
        <Button variant="outline" className="text-sm ml-auto">
          <Check className="w-4 h-4 mr-1" />
          Выучил
        </Button>
      </div>
    </motion.div>
  )
}