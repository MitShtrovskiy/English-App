import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Volume2, RefreshCcw, Check } from 'lucide-react'
import { speak } from '../utils/speak'
import classNames from 'classnames'

interface Word {
  id: number
  word: string
  translation: string
  example: string
  transcription: string
  learned: boolean
}

interface Props {
  word: Word
  isEnglish: boolean
  hideTranslation: boolean
  onToggleLanguage: () => void
  onToggleTranslation: () => void
  onMarkAsLearned: () => void
}

const gradients = [
  'from-pink-500 via-red-500 to-yellow-500',
  'from-purple-500 via-indigo-500 to-blue-500',
  'from-teal-400 via-green-500 to-lime-500',
  'from-orange-400 via-pink-500 to-red-500',
  'from-cyan-400 via-sky-500 to-indigo-500',
]

export default function WordCard({
  word,
  isEnglish,
  hideTranslation,
  onToggleLanguage,
  onToggleTranslation,
  onMarkAsLearned,
}: Props) {
  const [gradientIndex] = useState(() => Math.floor(Math.random() * gradients.length))
  const displayedWord = isEnglish ? word.word : word.translation
  const translation = isEnglish ? word.translation : word.word
  const wordInExample = isEnglish ? word.word : word.word
  const example = word.example.replace(
    new RegExp(`(${wordInExample})`, 'gi'),
    (_, match) =>
      hideTranslation && !isEnglish
        ? `<span class="blur-sm bg-zinc-900/40 px-1 rounded">${match}</span>`
        : `<strong>${match}</strong>`
  )

  return (
    <motion.div
      className={classNames(
        'p-6 rounded-2xl text-white w-full shadow-xl space-y-4 border border-white/10',
        'bg-gradient-to-br',
        gradients[gradientIndex]
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <div className="space-y-1">
        <div className="text-3xl font-bold">{displayedWord}</div>
        <div className="text-sm text-white/80">{word.transcription}</div>
        <div
          className={classNames(
            'text-lg',
            hideTranslation ? 'blur-sm bg-black/30 px-2 py-1 rounded inline-block' : ''
          )}
        >
          {hideTranslation ? translation : translation}
        </div>
      </div>

      <div
        className="text-sm text-white/90"
        dangerouslySetInnerHTML={{ __html: example }}
      />

      <div className="flex justify-between items-center pt-4 gap-3 flex-wrap">
        <button
          onClick={onToggleLanguage}
          className="p-2 px-3 text-sm rounded-xl bg-white/10 hover:bg-white/20"
        >
          <RefreshCcw className="w-4 h-4 inline mr-1" />
          Язык
        </button>

        <button
          onClick={onToggleTranslation}
          className="p-2 px-3 text-sm rounded-xl bg-white/10 hover:bg-white/20"
        >
          <Eye className="w-4 h-4 inline" />
        </button>

        <button
          onClick={() => speak(word.word)}
          className="p-2 px-3 text-sm rounded-xl bg-white/10 hover:bg-white/20"
        >
          <Volume2 className="w-4 h-4 inline" />
        </button>

        <button
          onClick={onMarkAsLearned}
          className="p-2 px-3 text-sm rounded-xl bg-white/10 hover:bg-white/20"
        >
          <Check className="w-4 h-4 inline mr-1" />
          Выучил
        </button>
      </div>
    </motion.div>
  )
}