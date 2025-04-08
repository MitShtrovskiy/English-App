import { useRef, useState } from 'react'
import Papa from 'papaparse'
import { api } from '@/utils/api'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface CSVUploadModalProps {
  open: boolean
  onClose: () => void
}

export default function CSVUploadModal({ open, onClose }: CSVUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  if (!open) return null // 🧼 Модалка отображается только если open=true

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setStatus('⏳ Обрабатываем CSV...')

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[]
        const validWords = rows.filter(row => row.word && row.translation)

        setStatus(`📤 Загружаем ${validWords.length} слов...`)

        try {
          for (const word of validWords) {
            await api.post('/words', {
              word: word.word,
              translation: word.translation,
              transcription: word.transcription || '',
              example: word.example || '',
              learned: String(word.learned).toLowerCase() === 'true',
            })
          }
          setStatus(`✅ Успешно загружено ${validWords.length} слов`)
        } catch (err) {
          console.error('❌ Ошибка загрузки:', err)
          setStatus('❌ Ошибка при загрузке')
        } finally {
          setIsUploading(false)
        }
      },
      error: (error) => {
        console.error('❌ Ошибка разбора CSV:', error)
        setStatus('❌ Ошибка при чтении файла')
        setIsUploading(false)
      },
    })
  }

  const closeAndReset = () => {
    setStatus(null)
    setIsUploading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] w-full max-w-md rounded-[20px] p-6 relative shadow-lg text-white">
        {/* Закрытие */}
        <button
          onClick={closeAndReset}
          className="absolute top-4 right-4 text-white/70 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Заголовок */}
        <h2 className="text-xl font-medium mb-1">Импорт CSV</h2>
        <p className="text-sm text-white/60 mb-5">
          Добавьте слова из CSV-файла. Поддерживается UTF-8 с BOM.
        </p>

        {/* Скрытое поле выбора */}
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Кнопка выбора файла */}
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full"
        >
          Выбрать CSV-файл
        </Button>

        {/* Статус */}
        {status && (
          <p className="mt-4 text-sm text-white/80 whitespace-pre-wrap">
            {status}
          </p>
        )}
      </div>
    </div>
  )
}