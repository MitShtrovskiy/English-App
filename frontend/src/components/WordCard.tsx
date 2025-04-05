import { Volume2, CheckCircle } from 'lucide-react'
import { api } from '../utils/api'

interface Word {
  id: number
  word: string
  transcription: string
  translation: string
  example: string
  learned: boolean
}

export default function WordCard({ word: w, onToggle }: { word: Word; onToggle: () => void }) {
  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(w.word)
    utterance.lang = 'en-US'
    speechSynthesis.speak(utterance)
  }

  const toggleLearned = async () => {
    await api.patch(`/words/${w.id}`, { learned: !w.learned })
    onToggle()
  }

  return (
    <div className="bg-surface p-4 rounded-2xl shadow-card space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{w.word}</h2>
        <span className="text-muted text-sm">{w.transcription}</span>
      </div>
      <div className="text-lg text-primary">{w.translation}</div>
      <p className="text-sm text-muted italic">"{w.example}"</p>
      <div className="flex justify-between pt-2">
        <button
          onClick={handleSpeak}
          className="text-muted hover:text-primary transition"
          title="Прослушать"
        >
          <Volume2 />
        </button>
        <button
          onClick={toggleLearned}
          className={`flex items-center gap-1 text-sm ${
            w.learned ? 'text-green-400' : 'text-muted'
          }`}
        >
          <CheckCircle size={18} />
          {w.learned ? 'Выучено' : 'Отметить'}
        </button>
      </div>
    </div>
  )
}