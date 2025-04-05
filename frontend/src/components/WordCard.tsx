import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Volume2, EyeOff, RefreshCcw, Check } from 'lucide-react'

interface WordCardProps {
  word: {
    id: number
    word: string
    transcription?: string
    translation: string
    example: string
    learned: boolean
  }
}

export default function WordCard({ word }: WordCardProps) {
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)
  const [isHidden, setIsHidden] = useState(true)

  const textToDisplay = isEnglishFirst ? word.word : word.translation
  const translation = isEnglishFirst ? word.translation : word.word

  const gradient = useMemo(() => {
    const gradients = [
      'from-pink-500 via-red-500 to-yellow-500',
      'from-indigo-500 via-purple-500 to-pink-500',
      'from-green-400 via-blue-500 to-purple-600',
      'from-yellow-400 via-orange-500 to-pink-500',
    ]
    return gradients[word.id % gradients.length]
  }, [word.id])

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(word.word)
    utterance.lang = 'en-US'
    speechSynthesis.speak(utterance)
  }

  const highlightExample = () => {
    const parts = word.example.split(new RegExp(`(${word.word})`, 'gi'))
    return parts.map((part, i) => {
      const isMatch = part.toLowerCase() === word.word.toLowerCase()
      return isMatch ? (
        <span key={i} className="relative font-semibold text-white">
          {isEnglishFirst || !isHidden ? (
            part
          ) : (
            <>
              {part}
              <span className="absolute inset-0 backdrop-blur-sm bg-black/60 rounded-sm" />
            </>
          )}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    })
  }

  return (
    <motion.div
      className={`rounded-3xl p-6 w-full h-full flex flex-col justify-between text-left border border-white/10 bg-gradient-to-br ${gradient} bg-clip-padding backdrop-blur-xl bg-opacity-60`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div>
        <h2 className="text-3xl font-bold text-white">{textToDisplay}</h2>
        {isEnglishFirst && word.transcription && (
          <p className="text-white/70 text-sm mt-1">{word.transcription}</p>
        )}
        <p
          className={`mt-2 text-white italic transition duration-300 ${
            isHidden ? 'blur-sm select-none' : ''
          }`}
        >
          {translation}
        </p>
        <p className="mt-4 text-sm text-white/90 leading-relaxed">{highlightExample()}</p>
      </div>

      <div className="flex justify-between items-center mt-6 gap-2 flex-wrap">
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setIsHidden(!isHidden)} size="icon">
            <EyeOff className="w-5 h-5" />
          </Button>
          <Button variant="ghost" onClick={speak} size="icon">
            <Volume2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" onClick={() => setIsEnglishFirst(!isEnglishFirst)} size="icon">
            <RefreshCcw className="w-5 h-5" />
          </Button>
        </div>
        <Button variant="outline" className="ml-auto text-white">
          <Check className="w-4 h-4 mr-2" />
          Выучил
        </Button>
      </div>
    </motion.div>
  )
}