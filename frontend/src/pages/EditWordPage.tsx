// src/pages/EditWordPage.tsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function EditWordPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [word, setWord] = useState({
    word: '',
    translation: '',
    transcription: '',
    example: '',
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      api.get(`/words/${id}`).then((res) => {
        setWord(res.data)
      })
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setWord((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!word.word.trim() || !word.translation.trim() || !word.example.trim()) {
      setError('Все поля должны быть заполнены.')
      return
    }
    await api.put(`/words/${id}`, word)
    navigate('/word-list')
  }

  const handleDelete = async () => {
    await api.delete(`/words/${id}`)
    navigate('/word-list')
  }

  return (
    <div className="max-w-[430px] mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          ← Назад
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Удалить
        </Button>
      </div>

      <div className="space-y-4">
        <Input
          name="word"
          placeholder="Слово"
          value={word.word}
          onChange={handleChange}
        />
        <Input
          name="translation"
          placeholder="Перевод"
          value={word.translation}
          onChange={handleChange}
        />
        <Input
          name="transcription"
          placeholder="Транскрипция"
          value={word.transcription}
          onChange={handleChange}
        />
        <Textarea
          name="example"
          placeholder="Пример использования"
          value={word.example}
          onChange={handleChange}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button onClick={handleSubmit} className="w-full mt-4">
        Сохранить
      </Button>
    </div>
  )
}