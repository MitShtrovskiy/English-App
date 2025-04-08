import { useRef, useState, useEffect } from 'react'
import Papa from 'papaparse'
import { api } from '@/utils/api'
import { Button } from '@/components/ui/button'
import { X, CheckCircle, AlertTriangle, Loader } from 'lucide-react'

interface CSVUploadModalProps {
  open: boolean
  onClose: () => void
}

interface WordRow {
  word: string
  translation: string
  transcription?: string
  example?: string
  learned?: boolean
  isDuplicate?: boolean
}

type UploadStage = 'preview' | 'uploading' | 'success'

export default function CSVUploadModal({ open, onClose }: CSVUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [allWords, setAllWords] = useState<string[]>([])
  const [csvWords, setCsvWords] = useState<WordRow[]>([])
  const [status, setStatus] = useState<string | null>(null)
  const [uploadStage, setUploadStage] = useState<UploadStage>('preview')
  const [uploadedCount, setUploadedCount] = useState(0)

  // 🧠 Загружаем все существующие слова
  useEffect(() => {
    if (!open) return
    api.get('/words').then(res => {
      const existingWords = res.data.map((w: any) => w.word.toLowerCase())
      setAllWords(existingWords)
    })
  }, [open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setStatus('⏳ Чтение CSV...')
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as any[]
        const processed = rows
          .filter(row => row.word && row.translation)
          .map((row) => ({
            word: row.word.trim(),
            translation: row.translation.trim(),
            transcription: row.transcription || '',
            example: row.example || '',
            learned: String(row.learned).toLowerCase() === 'true',
            isDuplicate: allWords.includes(row.word.trim().toLowerCase()),
          }))
        setCsvWords(processed)
        setStatus(null)
        setUploadStage('preview')
      },
      error: () => {
        setStatus('❌ Ошибка чтения файла')
      },
    })
  }

  const handleUpload = async () => {
    const newWords = csvWords.filter(w => !w.isDuplicate)
    setUploadStage('uploading')
    setUploadedCount(0)

    for (let i = 0; i < newWords.length; i++) {
      const word = newWords[i]
      try {
        await api.post('/words', {
          word: word.word,
          translation: word.translation,
          transcription: word.transcription || '',
          example: word.example || '',
          learned: word.learned || false,
        })
        setUploadedCount(i + 1)
      } catch (err) {
        console.warn(`⚠️ Проблема с добавлением "${word.word}"`, err)
      }
    }

    setUploadStage('success')
  }

  const closeAndReset = () => {
    setStatus(null)
    setCsvWords([])
    setUploadStage('preview')
    setUploadedCount(0)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[20px] p-6 relative shadow-lg text-white">
        <button
          onClick={closeAndReset}
          className="absolute top-4 right-4 text-white/70 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-medium mb-1">Импорт CSV</h2>
        <p className="text-sm text-white/60 mb-4">
          Загрузите слова из файла. Повторяющиеся автоматически пропускаются.
        </p>

        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {uploadStage === 'preview' && (
          <>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="mb-4"
            >
              Выбрать CSV-файл
            </Button>

            {csvWords.length > 0 && (
              <>
                <div className="max-h-[300px] overflow-y-auto border border-white/10 rounded-lg text-sm mb-4">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-white/10">
                        <th className="text-left px-3 py-2">Слово</th>
                        <th className="text-left px-3 py-2">Перевод</th>
                        <th className="text-left px-3 py-2">Дубликат</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvWords.map((w, i) => (
                        <tr key={i} className={w.isDuplicate ? 'bg-red-900/20' : ''}>
                          <td className="px-3 py-2">{w.word}</td>
                          <td className="px-3 py-2">{w.translation}</td>
                          <td className="px-3 py-2">
                            {w.isDuplicate ? (
                              <span className="text-red-400 flex items-center gap-1">
                                <AlertTriangle className="w-4 h-4" /> Дубликат
                              </span>
                            ) : (
                              <span className="text-green-400 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> Новое
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Button onClick={handleUpload} className="w-full">
                  Загрузить только новые слова
                </Button>
              </>
            )}
          </>
        )}

        {uploadStage === 'uploading' && (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <Loader className="animate-spin w-8 h-8 text-white/80" />
            <p className="text-white/70 text-sm">
              Загружено {uploadedCount} из {csvWords.filter(w => !w.isDuplicate).length}...
            </p>
          </div>
        )}

        {uploadStage === 'success' && (
          <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
            <CheckCircle className="w-10 h-10 text-green-400" />
            <p className="text-lg">Загрузка завершена 🎉</p>
            <Button onClick={closeAndReset}>Закрыть</Button>
          </div>
        )}

        {status && <p className="mt-4 text-white/70 text-sm">{status}</p>}
      </div>
    </div>
  )
}