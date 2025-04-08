import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

interface WordFormData {
  word: string
  translation: string
  transcription: string
  example: string
  learned: boolean
}

export default function EditWordPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()

  const isNew = !id || id === 'new'
  const numericId = !isNew && id ? Number(id) : null

  console.log('🧠 useParams id:', id)
  console.log('🟢 isNew:', isNew)
  console.log('🔢 numericId:', numericId)

  const [word, setWord] = useState<WordFormData>({
    word: '',
    translation: '',
    transcription: '',
    example: '',
    learned: false,
  })

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!numericId) return

    setLoading(true)
    api
      .get(`/words/${numericId}`)
      .then((res) => setWord(res.data))
      .catch(() => setError('Не удалось загрузить слово.'))
      .finally(() => setLoading(false))
  }, [numericId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setWord((prev) => ({ ...prev, [name]: value }))
  }

  const toggleLearned = (value: boolean) => {
    setWord((prev) => ({ ...prev, learned: value }))
  }

  const handleSubmit = async () => {
    setError(null)
    console.log('📤 handleSubmit → isNew:', isNew, 'id:', id, 'numericId:', numericId)

    if (!word.word.trim()) {
      setError('Поле "Слово" обязательно.')
      return
    }
    if (!word.translation.trim()) {
      setError('Поле "Перевод" обязательно.')
      return
    }

    try {
      if (isNew) {
        console.log('📦 POST /words', word)
        await api.post('/words', word)
      } else if (numericId) {
        console.log(`🛠 PUT /words/${numericId}`, word)
        await api.put(`/words/${numericId}`, word)
      } else {
        setError('Некорректный ID.')
        return
      }

      navigate('/words')
    } catch (err) {
      console.error('❌ Ошибка при сохранении:', err)
      setError('Ошибка при сохранении. Попробуйте позже.')
    }
  }

  const handleDelete = async () => {
    if (!numericId) {
      setError('Некорректный ID для удаления.')
      return
    }

    try {
      console.log(`🗑 DELETE /words/${numericId}`)
      await api.delete(`/words/${numericId}`)
      navigate('/words')
    } catch (err) {
      console.error('❌ Ошибка при удалении:', err)
      setError('Ошибка при удалении. Попробуйте позже.')
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
        <Input name="translation" placeholder="Перевод" value={word.translation} onChange={handleChange} />
        <Input name="transcription" placeholder="Транскрипция" value={word.transcription} onChange={handleChange} />
        <Textarea name="example" placeholder="Пример использования" value={word.example} onChange={handleChange} />
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-white/80">Выучено</span>
          <Switch checked={word.learned} onCheckedChange={toggleLearned} />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loading && <p className="text-white/70 text-sm">Загрузка слова...</p>}

      <Button onClick={handleSubmit} className="w-full mt-4">
        Сохранить
      </Button>
    </div>
  )
}