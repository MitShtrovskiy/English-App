import { useState } from 'react'
import { api } from '../utils/api'
import { useNavigate } from 'react-router-dom'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const navigate = useNavigate()

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    await api.post('/upload', formData)
    navigate('/')
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-xl font-bold mb-4">Загрузка слов</h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-white text-black px-4 py-2 rounded"
      >
        Загрузить
      </button>
    </div>
  )
}