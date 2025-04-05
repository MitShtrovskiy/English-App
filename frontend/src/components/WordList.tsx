import { useNavigate } from 'react-router-dom'

interface Word {
  id: number
  word: string
  translation: string
  learned: boolean
}

interface WordListProps {
  words: Word[]
}

export default function WordList({ words }: WordListProps) {
  const navigate = useNavigate()

  return (
    <div className="px-4 space-y-2">
      {words.map((word) => (
        <div
          key={word.id}
          onClick={() => navigate(`/edit/${word.id}`)}
          className="bg-white/5 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/10 transition cursor-pointer"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{word.word}</p>
              <p className="text-sm text-white/50">{word.translation}</p>
            </div>
            {word.learned && (
              <span className="text-xs text-green-400 bg-green-900/40 px-2 py-0.5 rounded-full">
                выучено
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}