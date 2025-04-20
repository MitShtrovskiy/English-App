import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import Navbar from '../components/Navbar'
import { AnimatePresence } from 'framer-motion'
import { getRandomGradient } from '../utils/gradients'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  const [words, setWords] = useState<any[]>([])
  const [index, setIndex] = useState(0)
  const [gradient, setGradient] = useState(getRandomGradient())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const fetchWords = async () => {
      try {
        const res = await api.get('/words')
        setWords(res.data)
      } catch (err: any) {
        console.error('Ошибка при получении слов:', err)
        if (err.response?.status === 401) {
          logout()
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchWords()
  }, [token])

  const filteredWords = words.filter((w) => !w.learned)
  const currentWord = filteredWords[index]

  const handleNext = () => {
    if (!filteredWords.length) return
    const nextIndex = (index + 1) % filteredWords.length
    setIndex(nextIndex)
    setGradient(getRandomGradient())
  }

  const handlePrev = () => {
    if (!filteredWords.length) return
    const prevIndex = (index - 1 + filteredWords.length) % filteredWords.length
    setIndex(prevIndex)
    setGradient(getRandomGradient())
  }

  const markAsLearned = async () => {
    if (!currentWord) return
    try {
      await api.patch(`/words/${currentWord.id}`, { learned: true })
      setWords((prev) =>
        prev.map((w) =>
          w.id === currentWord.id ? { ...w, learned: true } : w
        )
      )
      handleNext()
    } catch (err) {
      console.error('Ошибка при обновлении слова:', err)
    }
  }

  return (
    <div className="relative flex flex-col items-center w-full max-w-[440px] mx-auto h-[100dvh] bg-black overflow-hidden">
      <Navbar
        totalCount={words.length}
        learnedCount={words.filter((w) => w.learned).length}
      />

      <div className="flex-1 w-full overflow-hidden relative">
        {loading ? (
          <div className="text-white text-center mt-10">Загрузка...</div>
        ) : (
          <AnimatePresence mode="wait">
            {currentWord && (
              <WordCard
                key={currentWord.id}
                word={currentWord}
                gradient={gradient}
                onMarkAsLearned={markAsLearned}
              />
            )}
          </AnimatePresence>
        )}
      </div>

      <div className="flex justify-center items-center gap-2 px-10 pb-4 pt-3 w-full">
        <button
          onClick={handlePrev}
          className="flex h-16 flex-col justify-center items-center gap-2 flex-1 rounded-[20px] bg-white/10 text-white"
        >
          Назад
        </button>
        <button
          onClick={handleNext}
          className="flex h-16 flex-col justify-center items-center gap-2 flex-1 rounded-[20px] bg-white/10 text-white"
        >
          Вперёд
        </button>
      </div>
    </div>
  )
}