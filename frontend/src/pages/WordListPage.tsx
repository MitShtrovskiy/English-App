import { useEffect, useState } from 'react'
import { api } from '@/utils/api'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface Word {
  id: number
  word: string
  translation: string
  learned: boolean
}

export default function WordListPage() {
  const [words, setWords] = useState<Word[]>([])
  const [filter, setFilter] = useState<'all' | 'learned' | 'unlearned'>('all')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/words').then((res) => setWords(res.data))
  }, [])

  const filteredWords = words.filter((word) => {
    if (filter === 'learned') return word.learned
    if (filter === 'unlearned') return !word.learned
    return true
  })

  return (
    <div className="max-w-[430px] mx-auto px-4 pt-16 pb-6">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>← Назад</Button>
        <span className="text-sm text-zinc-400">{filteredWords.length} слов</span>
      </div>

      <div className="flex gap-2 mb-4">
        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
          Все
        </Button>
        <Button variant={filter === 'unlearned' ? 'default' : 'outline'} onClick={() => setFilter('unlearned')}>
          Не выученные
        </Button>
        <Button variant={filter === 'learned' ? 'default' : 'outline'} onClick={() => setFilter('learned')}>
          Выученные
        </Button>
      </div>

      <ul className="space-y-2">
        {filteredWords.map((word) => (
          <li
            key={word.id}
            onClick={() => navigate(`/edit-word/${word.id}`)}
            className="p-4 bg-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-700 transition"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-white">{word.word}</span>
              {word.learned && (
                <span className="text-xs text-green-400 bg-green-900 px-2 py-0.5 rounded">
                  выучено
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{word.translation}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}