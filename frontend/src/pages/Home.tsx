import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import WordCard from '../components/WordCard'
import TinderCard from 'react-tinder-card'

export default function Home() {
  const [words, setWords] = useState<any[]>([])

  const fetchWords = () => {
    api.get('/words').then((res) => setWords(res.data))
  }

  useEffect(() => {
    fetchWords()
  }, [])

  const handleSwipe = (dir: string, wordId: number) => {
    if (dir === 'right') {
      api.patch(`/words/${wordId}`, { learned: true }).then(fetchWords)
    }
  }

  return (
    <div className="relative h-[90vh] overflow-hidden flex items-center justify-center max-w-[430px] mx-auto">
      {words
        .filter((word) => !word.learned)
        .slice()
        .reverse() // ⬅️ Вот эта строка!
        .map((word) => (
          <TinderCard
            key={word.id}
            onSwipe={(dir) => handleSwipe(dir, word.id)}
            preventSwipe={['up', 'down']}
          >
            <div className="absolute w-full px-4">
              <WordCard word={word} />
            </div>
          </TinderCard>
        ))}
    </div>
  )
}