import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../utils/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Trash2 } from 'lucide-react'

export default function EditWordPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [word, setWord] = useState('')
  const [translation, setTranslation] = useState('')
  const [example, setExample] = useState('')
  const [transcription, setTranscription] = useState('')
  const [learned, setLearned] = useState(false)

  useEffect(() => {
    if (id) {
      api.get(`/words/${id}`).then((res) => {
        const data = res.data
        setWord(data.word)
        setTranslation(data.translation)
        setExample(data.example)
        setTranscription(data.transcription || '')
        setLearned(data.learned)
      })
    }
  }, [id])

  const handleSubmit = async () => {
    if (!word || !translation || !example) {
      alert('Пожалуйста, заполните все поля')
      return
    }

    await api.patch(`/words/${id}`, {
      word,
      translation,
      example,
      transcription,
      learned
    })

    navigate('/word-list')
  }

  const handleDelete = async () => {
    if (!confirm('Точно удалить это слово?')) return

    await api.delete(`/words/${id}`)
    navigate('/word-list')
  }

  return (
    <div className="max-w-[430px] mx-auto px-4 py-6 space-y-6">
      {/* Кнопка назад */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="absolute top-4 left-4">
        <ArrowLeft className="w-5 h-5" />
      </Button>

      <h1 className="text-2xl font-bold mb-4 text-center">Редактирование слова</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Слово (на английском)</Label>
          <Input value={word} onChange={(e) => setWord(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Перевод</Label>
          <Input value={translation} onChange={(e) => setTranslation(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Транскрипция</Label>
          <Input value={transcription} onChange={(e) => setTranscription(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Пример</Label>
          <Input value={example} onChange={(e) => setExample(e.target.value)} />
        </div>

        <div className="flex items-center justify-between">
          <Label>Выучено</Label>
          <Switch checked={learned} onCheckedChange={setLearned} />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button className="flex-1" onClick={handleSubmit}>
          Сохранить
        </Button>
        <Button variant="destructive" className="flex-1" onClick={handleDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          Удалить
        </Button>
      </div>
    </div>
  )
}