import { useEffect, useState } from 'react'
import WordCard from '../components/WordCard'
import { api } from '../utils/api'

export default function Home() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchWords = async () => {
    try {
      const res = await api.get('/words')
      setWords(res.data)
      setLoading(false)
    } catch (err) {
      console.error('Ошибка загрузки слов', err)
    }
  }

  useEffect(() => {
    fetchWords()
  }, [])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-lg">
        Загрузка...
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[100dvh] pt-[64px] pb-[env(safe-area-inset-bottom)] px-4 overflow-hidden max-w-[430px] mx-auto">
      {words.length > 0 && (
        <WordCard
          word={words[currentIndex]}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  )
}