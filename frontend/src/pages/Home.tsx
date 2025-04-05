import { useEffect, useState } from 'react'
import { api } from '../utils/api'

export default function Home() {
  const [words, setWords] = useState([])

  useEffect(() => {
    api.get('/words').then(res => setWords(res.data))
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Ежедневная практика</h1>
      {words.map((word: any) => (
        <div key={word.id} className="mb-4 p-4 bg-gray-800 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">{word.word}</h2>
            <span className="text-sm text-gray-400">{word.transcription}</span>
          </div>
          <p className="text-gray-300 mt-2">{word.translation}</p>
          <p className="text-gray-500 text-sm mt-1 italic">"{word.example}"</p>
        </div>
      ))}
    </div>
  )
}
