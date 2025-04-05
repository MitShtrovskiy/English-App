import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Volume2, EyeOff, RefreshCcw, Check } from 'lucide-react'
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
}

const gradients = [
  'from-pink-500 to-yellow-500',
  'from-green-400 to-blue-500',
  'from-purple-500 to-pink-500',
  'from-orange-400 to-red-500',
  'from-sky-400 to-indigo-500',
  'from-emerald-400 to-teal-500',
]

export default function WordCard({ word }: WordCardProps) {
  const [hideTranslation, setHideTranslation] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)

  const gradient = useMemo(() => gradients[Math.floor(Math.random() * gradients.length)], [word.id])

  const mainText = isEnglishFirst ? word.word : word.translation
  const translation = isEnglishFirst ? word.translation : word.word

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(word.word)
    utterance.lang = 'en-US'
    speechSynthesis.speak(utterance)
  }

  const highlightedExample = () => {
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
                {isEnglishFirst || !hideTranslation ? (
                  matches[i]
                ) : (
                  <>
                    {matches[i]}
                    <span className="absolute inset-0 bg-zinc-900/70 backdrop-blur-sm rounded-sm" />
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
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`w-full h-full flex flex-col justify-between rounded-3xl p-6 border border-white/10 bg-gradient-to-br ${gradient} bg-clip-padding backdrop-blur-md bg-opacity-10`}
    >
      <div className="space-y-3">
        <div>
          <h2 className="text-3xl font-bold">{mainText}</h2>
          {isEnglishFirst && word.transcription && (
            <p className="text-muted-foreground text-sm mt-1">{word.transcription}</p>
          )}
        </div>

        <p className={`italic text-sm relative inline-block transition ${hideTranslation ? 'blur-sm select-none' : ''}`}>
          {translation}
        </p>

        <p className="text-sm mt-4 leading-relaxed">{highlightedExample()}</p>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setHideTranslation(!hideTranslation)}>
            <EyeOff className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={playAudio}>
            <Volume2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsEnglishFirst(!isEnglishFirst)}>
            <RefreshCcw className="w-5 h-5" />
          </Button>
        </div>

        <Button variant="outline" className="text-sm">
          <Check className="w-4 h-4 mr-2" />
          Выучил
        </Button>
      </div>
    </motion.div>
  )
}