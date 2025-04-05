import { useRef, useState } from 'react'
import { api } from '../utils/api'
import Papa from 'papaparse'

export default function CSVUploadModal() {
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const requiredHeaders = ['word', 'transcription', 'translation', 'example', 'learned']

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setSuccess('')
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const headers = results.meta.fields || []
        const isValid = requiredHeaders.every((h) => headers.includes(h))

        if (!isValid) {
          setError('Некорректная структура CSV. Требуемые поля: ' + requiredHeaders.join(', '))
          return
        }

        try {
          setLoading(true)
          const formData = new FormData()
          formData.append('file', file)
          await api.post('/words/upload-csv', formData)
          setSuccess('Файл успешно загружен!')
        } catch (err) {
          setError('Ошибка при загрузке файла.')
        } finally {
          setLoading(false)
        }
      },
    })
  }

  return (
    <div className="p-4 space-y-4 max-w-[430px] mx-auto">
      <h1 className="text-xl font-bold">Загрузка CSV</h1>

      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFile}
        className="w-full text-sm text-white bg-surface p-2 rounded-xl border border-muted"
      />

      {fileName && <p className="text-sm text-muted">Файл: {fileName}</p>}
      {loading && <p className="text-sm text-primary">Загрузка...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-500">{success}</p>}
    </div>
  )
}