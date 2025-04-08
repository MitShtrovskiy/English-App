import { useRef, useState } from 'react'
import Papa from 'papaparse'
import { api } from '@/utils/api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

interface CSVUploadModalProps {
  open: boolean
  onClose: () => void
}

export default function CSVUploadModal({ open, onClose }: CSVUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

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

  const handleClose = () => {
    setStatus(null)
    setIsUploading(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Импорт CSV</DialogTitle>
          <DialogDescription>Добавьте слова из CSV-файла. Поддерживается UTF-8 с BOM.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
          >
            Выбрать CSV-файл
          </Button>

          {status && <p className="text-sm text-white/70">{status}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}