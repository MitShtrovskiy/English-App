import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch' // Добавим Switch

export default function EditWordPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new' // ✅ новый режим

  const [word, setWord] = useState({
    word: '',
    translation: '',
    transcription: '',
    example: '',
    learned: false,
  })

  const [error, setError] = useState<string | null>(null)

      // 🔁 Загрузка слова (или пропуск, если 'new')
      useEffect(() => {
        if (!id || isNew) return // ✅ Пропускаем загрузку, если создаём новое слово
        
        api.get(`/words/${id}`)
          .then((res) => setWord(res.data))
          .catch(() => setError('Не удалось загрузить слово.'))
      }, [id])

  // 📥 Обработка изменения текстовых полей
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setWord((prev) => ({ ...prev, [name]: value }))
  }

  // ✅ Обработка переключателя "Выучено"
  const toggleLearned = (value: boolean) => {
    setWord((prev) => ({ ...prev, learned: value }))
  }

  // 💾 Сохранение
  const handleSubmit = async () => {
    if (!word.word.trim() || !word.translation.trim() || !word.example.trim()) {
      setError('Все поля должны быть заполнены.')
      return
    }

    try {
      if (isNew) {
        await api.post('/words', word) // ✅ Создание нового слова
        
      } else {
        await api.put(`/words/${id}`, word)// ✅ Обновление
      }
      
      navigate('/words') // ✅ Переход к списку
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
        <Input name="word" placeholder="Слово" value={word.word} onChange={handleChange} />
        <Input name="translation" placeholder="Перевод" value={word.translation || ''} onChange={handleChange} />
        <Input name="transcription" placeholder="Транскрипция" value={word.transcription || ''} onChange={handleChange} />
        <Textarea name="example" placeholder="Пример использования" value={word.example || ''} onChange={handleChange} />

        {/* ✅ Переключатель "Выучено" */}
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