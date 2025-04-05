import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'

export default function Home() {
  const [words, setWords] = useState<any[]>([])

  const fetchWords = () => {
    api.get('/words').then((res) => setWords(res.data))
  }

  useEffect(() => {
    fetchWords()
  }, [])

  return (
    <div className="p-4 space-y-4 mb-20 max-w-[430px] mx-auto">
      {words.map((word) => (
        <WordCard key={word.id} word={word} onToggle={fetchWords} />
      ))}
    </div>
  )
}