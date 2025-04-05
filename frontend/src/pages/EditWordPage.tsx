import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@/utils/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function EditWordPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    word: '',
    translation: '',
    transcription: '',
    example: '',
  })

  const fetchWord = async () => {
    const res = await api.get(`/words/${id}`)
    setForm(res.data)
  }

  useEffect(() => {
    fetchWord()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (!form.word.trim() || !form.translation.trim()) return alert('Все поля обязательны')
    await api.put(`/words/${id}`, form)
    navigate('/words')
  }

  const handleDelete = async () => {
    if (confirm('Удалить слово?')) {
      await api.delete(`/words/${id}`)
      navigate('/words')
    }
  }

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        ← Назад
      </Button>

      <Input placeholder="Слово" name="word" value={form.word} onChange={handleChange} required />
      <Input placeholder="Перевод" name="translation" value={form.translation} onChange={handleChange} required />
      <Input placeholder="Транскрипция" name="transcription" value={form.transcription} onChange={handleChange} />
      <Textarea placeholder="Пример использования" name="example" value={form.example} onChange={handleChange} />

      <div className="flex justify-between gap-2 pt-4">
        <Button variant="destructive" onClick={handleDelete}>
          Удалить
        </Button>
        <Button onClick={handleSave}>Сохранить</Button>
      </div>
    </div>
  )
}