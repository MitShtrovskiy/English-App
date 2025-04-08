import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

export default function EditWordPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'
  const navigate = useNavigate()

  const [word, setWord] = useState({
    word: '',
    translation: '',
    transcription: '',
    example: '',
    learned: false,
  })

  const [error, setError] = useState<string | null>(null)

  // 🔁 Загрузка слова (если редактирование)
  useEffect(() => {
    if (!id || isNew) return
    api.get(`/words/${id}`)
      .then((res) => setWord(res.data))
      .catch(() => setError('Не удалось загрузить слово.'))
  }, [id])

  // 📥 Обработка текстовых полей
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setWord((prev) => ({ ...prev, [name]: value }))
  }

  // ✅ Переключатель "Выучено"
  const toggleLearned = (value: boolean) => {
    setWord((prev) => ({ ...prev, learned: value }))
  }

  // 💾 Сохранение
  const handleSubmit = async () => {
    const cleaned = {
      ...word,
      word: word.word.trim(),
      translation: (word.translation || '').trim(),
      transcription: (word.transcription || '').trim(),
      example: (word.example || '').trim(),
    }

    // ⛔ Проверка обязательных полей
    if (!cleaned.word || !cleaned.translation || !cleaned.example) {
      setError('Все поля должны быть заполнены.')
      return
    }

    try {
      console.log('Отправка:', cleaned) // ✅ Лог запроса
      if (isNew) {
        await api.post('/words', cleaned)
      } else {
        await api.put(`/words/${id}`, cleaned)
      }
      navigate('/words')
    } catch {
      setError('Ошибка при сохранении.')
    }
  }

  // 🗑 Удаление
  const handleDelete = async () => {
    try {
      await api.delete(`/words/${id}`)
      navigate('/words')
    } catch {
      setError('Ошибка при удалении.')
    }
  }

  return (
    <div className="max-w-[430px] mx-auto px-4 py-6 space-y-6">
      {/* 🔙 Навигация */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>← Назад</Button>
        <Button variant="destructive" onClick={handleDelete}>Удалить</Button>
      </div>

      {/* 📝 Форма */}
      <div className="space-y-4">
        <Input name="word" placeholder="Слово" value={word.word || ''} onChange={handleChange} />
        <Input name="translation" placeholder="Перевод" value={word.translation || ''} onChange={handleChange} />
        <Input name="transcription" placeholder="Транскрипция" value={word.transcription || ''} onChange={handleChange} />
        <Textarea name="example" placeholder="Пример использования" value={word.example || ''} onChange={handleChange} />

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-white/80">Выучено</span>
          <Switch checked={word.learned} onCheckedChange={toggleLearned} />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button onClick={handleSubmit} className="w-full mt-4">Сохранить</Button>
    </div>
  )
}