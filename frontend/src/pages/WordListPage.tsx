import { useEffect, useState } from 'react'
import { api } from '@/utils/api'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

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
    <div className="max-w-[440px] mx-auto min-h-screen flex flex-col px-5 pt-14 pb-10 bg-black text-white">
      {/* 🔙 Навигация и счётчик */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="w-12 h-12 p-0 rounded-[20px] bg-white/10"
        >
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </Button>
        <span className="text-sm text-white/60">{filteredWords.length} слов</span>
      </div>

      {/* 🧩 Фильтрация */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          className="flex-1 h-10"
          onClick={() => setFilter('all')}
        >
          Все
        </Button>
        <Button
          variant={filter === 'unlearned' ? 'default' : 'outline'}
          className="flex-1 h-10"
          onClick={() => setFilter('unlearned')}
        >
          Не выученные
        </Button>
        <Button
          variant={filter === 'learned' ? 'default' : 'outline'}
          className="flex-1 h-10"
          onClick={() => setFilter('learned')}
        >
          Выученные
        </Button>
      </div>

      {/* 📋 Список слов */}
      <ul className="space-y-3 flex-1 overflow-auto">
        {filteredWords.map((word) => (
          <li
            key={word.id}
            onClick={() => navigate(`/edit-word/${word.id}`)}
            className="p-4 bg-white/5 rounded-[20px] cursor-pointer transition hover:bg-white/10"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-lg text-white">{word.word}</span>
              {word.learned && (
                <span className="text-xs text-green-400 bg-green-900/50 px-2 py-0.5 rounded-full">
                  выучено
                </span>
              )}
            </div>
            <p className="text-sm text-white/60">{word.translation}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}