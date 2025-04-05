import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/utils/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function EditWordPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [wordData, setWordData] = useState({
    word: '',
    translation: '',
    transcription: '',
    example: '',
  })

  useEffect(() => {
    api.get(`/words/${id}`).then((res) => setWordData(res.data))
  }, [id])

  const handleSave = () => {
    api.patch(`/words/${id}`, wordData).then(() => navigate('/list'))
  }

  return (
    <div className="max-w-[430px] mx-auto px-4 pt-6 text-white">
      <h1 className="text-xl font-bold mb-4">Редактировать слово</h1>

      <div className="space-y-4">
        <Input
          placeholder="Слово"
          value={wordData.word}
          onChange={(e) => setWordData({ ...wordData, word: e.target.value })}
        />
        <Input
          placeholder="Перевод"
          value={wordData.translation}
          onChange={(e) => setWordData({ ...wordData, translation: e.target.value })}
        />
        <Input
          placeholder="Транскрипция"
          value={wordData.transcription}
          onChange={(e) => setWordData({ ...wordData, transcription: e.target.value })}
        />
        <Textarea
          placeholder="Пример использования"
          value={wordData.example}
          onChange={(e) => setWordData({ ...wordData, example: e.target.value })}
        />
        <Button onClick={handleSave}>Сохранить</Button>
      </div>
    </div>
  )
}