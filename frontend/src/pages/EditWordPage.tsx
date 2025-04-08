import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

export default function EditWordPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()

  const isNew = id === 'new' || !id

  const [word, setWord] = useState({
    word: '',
    translation: '',
    transcription: '',
    example: '',
    learned: false,
  })

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || isNew) return
    api
      .get(`/words/${id}`)
      .then((res) => setWord(res.data))
      .catch(() => setError('Не удалось загрузить слово.'))
  }, [id, isNew])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setWord((prev) => ({ ...prev, [name]: value }))
  }

  const toggleLearned = (value: boolean) => {
    setWord((prev) => ({ ...prev, learned: value }))
  }

  const handleSubmit = async () => {
    setError(null)

    if (!word.word.trim() || !word.translation.trim()) {
      setError('Слово и перевод обязательны.')
      return
    }

    try {
      if (isNew) {
        await api.post('/words', word)
      } else if (id) {
        await api.put(`/words/${Number(id)}`, word)
      }
      navigate('/words')
    } catch (e: any) {
      console.error('Ошибка сохранения:', e)
      setError('Ошибка при сохранении.')
    }
  }

  const handleDelete = async () => {
    try {
      if (id) {
        await api.delete(`/words/${Number(id)}`)
        navigate('/words')
      }
    } catch {
      setError('Ошибка при удалении.')
    }
  }

  return (
    <div className="max-w-[430px] mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          ← Назад
        </Button>
        {!isNew && (
          <Button variant="destructive" onClick={handleDelete}>
            Удалить
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <Input name="word" placeholder="Слово" value={word.word} onChange={handleChange} />
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
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-white/80">Выучено</span>
          <Switch checked={word.learned} onCheckedChange={toggleLearned} />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button onClick={handleSubmit} className="w-full mt-4">
        Сохранить
      </Button>
    </div>
  )
}