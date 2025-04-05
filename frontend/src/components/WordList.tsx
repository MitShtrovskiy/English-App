import { useEffect, useState } from 'react'
import { api } from '@/utils/api'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function WordList() {
  const [words, setWords] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'learned' | 'not-learned'>('all')
  const navigate = useNavigate()

  const fetchWords = async () => {
    const res = await api.get('/words')
    setWords(res.data)
  }

  useEffect(() => {
    fetchWords()
  }, [])

  const filteredWords = words.filter((word) => {
    if (filter === 'learned') return word.learned
    if (filter === 'not-learned') return !word.learned
    return true
  })

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <div className="flex gap-2 justify-center mb-4">
        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
          Все
        </Button>
        <Button variant={filter === 'not-learned' ? 'default' : 'outline'} onClick={() => setFilter('not-learned')}>
          Не выученные
        </Button>
        <Button variant={filter === 'learned' ? 'default' : 'outline'} onClick={() => setFilter('learned')}>
          Выученные
        </Button>
      </div>

      {filteredWords.map((word) => (
        <div
          key={word.id}
          className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 shadow cursor-pointer hover:bg-zinc-800 transition"
          onClick={() => navigate(`/words/${word.id}/edit`)}
        >
          <div className="flex justify-between items-center">
            <span className="font-semibold text-white">{word.word}</span>
            {word.learned && <span className="text-green-400 text-sm">✓</span>}
          </div>
          <p className="text-muted-foreground text-sm">{word.translation}</p>
        </div>
      ))}
    </div>
  )
}