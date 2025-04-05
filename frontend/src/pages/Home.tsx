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
      // свайп вправо = выучено
      api.patch(`/words/${wordId}`, { learned: true }).then(fetchWords)
    }
  }

  return (
    <div className="relative h-[90vh] flex items-center justify-center max-w-[430px] mx-auto">
      {words
        .filter((word) => !word.learned) // показываем только невыученные
        .map((word) => (
          <TinderCard
            key={word.id}
            preventSwipe={['up', 'down']}
            onSwipe={(dir) => handleSwipe(dir, word.id)}
            className="absolute w-[90%] max-w-md"
          >
            <WordCard word={word} />
          </TinderCard>
        ))}
    </div>
  )
}