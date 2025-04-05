// src/pages/WordListPage.tsx
import { useEffect, useState } from 'react'
import { api } from '@/utils/api'
import { Input } from '@/components/ui/input'
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
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const fetchWords = () => {
    api.get('/words').then((res) => setWords(res.data))
  }

  useEffect(() => {
    fetchWords()
  }, [])

  const filteredWords = words.filter((word) =>
    word.word.toLowerCase().includes(search.toLowerCase()) ||
    word.translation.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 max-w-[430px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => navigate(-1)} variant="ghost">Назад</Button>
        <h1 className="text-xl font-bold">Список слов</h1>
      </div>

      <Input
        placeholder="Поиск..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      <div className="space-y-2">
        {filteredWords.map((word) => (
          <div
            key={word.id}
            className={`p-4 rounded-lg border cursor-pointer transition hover:bg-zinc-800 ${word.learned ? 'opacity-50' : ''}`}
            onClick={() => navigate(`/edit/${word.id}`)}
          >
            <div className="text-base font-semibold">{word.word}</div>
            <div className="text-sm text-muted-foreground">{word.translation}</div>
          </div>
        ))}
      </div>
    </div>
  )
}