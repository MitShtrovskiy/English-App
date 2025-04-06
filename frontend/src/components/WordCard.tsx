import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, EyeOff, RefreshCcw, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { speak } from '@/utils/speak'
import { cn } from '@/utils/cn'

interface Word {
  id: number
  word: string
  translation: string
  example: string
  transcription?: string
  learned: boolean
}

interface Props {
  word: Word
}

const gradients = [
  'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  // ... добавь ещё 30, если хочешь :)
]

export default function WordCard({ word }: Props) {
  const [isTranslationHidden, setIsTranslationHidden] = useState(true)
  const [isEnglishFirst, setIsEnglishFirst] = useState(true)

  const gradient = useMemo(() => {
    return gradients[Math.floor(Math.random() * gradients.length)]
  }, [word.id])

  const textToDisplay = isEnglishFirst ? word.word : word.translation
  const translation = isEnglishFirst ? word.translation : word.word

  const exampleParts = word.example.split(new RegExp(`\\b${word.word}\\b`, 'gi'))

  const match = word.example.match(new RegExp(`\\b${word.word}\\b`, 'i'))

  const renderExample = () => {
    if (!match) return word.example
    const highlighted = (
      <span className="relative font-bold text-white">
        {match[0]}
        {!isEnglishFirst && isTranslationHidden && (
          <span className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-sm"></span>
        )}
      </span>
    )

    return (
      <>
        {exampleParts[0]}
        {highlighted}
        {exampleParts[1]}
      </>
    )
  }

  return (
    <motion.div
      className="relative w-full h-full rounded-[28px] overflow-hidden shadow-xl text-white"
      style={{ backgroundImage: gradient }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Content */}
      <div className="flex flex-col justify-between h-full p-6 pt-[env(safe-area-inset-top)] pb-[120px] bg-black/20 backdrop-blur-xl">
        {/* Top block */}
        <div className="space-y-2 text-left">
          <h2 className="text-3xl font-bold">{textToDisplay}</h2>
          {isEnglishFirst && word.transcription && (
            <p className="text-sm text-white/70">{word.transcription}</p>
          )}
          <p
            className={cn(
              'italic text-sm mt-1 transition',
              isTranslationHidden && 'blur-sm select-none'
            )}
          >
            {translation}
          </p>
        </div>

        {/* Example */}
        <div className="text-sm text-white mt-6 leading-relaxed">
          {renderExample()}
        </div>

        {/* Controls */}
        <div className="absolute left-0 right-0 bottom-0 p-4 pt-3 flex justify-between items-center bg-black/30 backdrop-blur-lg rounded-b-[28px]">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsTranslationHidden((prev) => !prev)}>
              <EyeOff className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => speak(word.word)}>
              <Volume2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsEnglishFirst((prev) => !prev)}>
              <RefreshCcw className="w-5 h-5" />
            </Button>
          </div>
          <Button variant="secondary" className="text-sm gap-2">
            <Check className="w-4 h-4" />
            Выучил
          </Button>
        </div>
      </div>
    </motion.div>
  )
}