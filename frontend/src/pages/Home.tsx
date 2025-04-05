import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import TinderCard from 'react-tinder-card'
import WordCard from '../components/WordCard'

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

  const unlearnedWords = words.filter((word) => !word.learned)

  return (
    <div className="relative h-[90vh] flex items-center justify-center max-w-[430px] mx-auto">
      {unlearnedWords.map((word) => (
        <TinderCard
          key={word.id}
          preventSwipe={['up', 'down']}
          onSwipe={(dir) => handleSwipe(dir, word.id)}
          className="absolute w-[90%] max-w-md"
        >
          <WordCard word={word} />
        </TinderCard>
      ))}
      {unlearnedWords.length === 0 && (
        <div className="text-center text-muted-foreground text-xl">
          Все слова выучены 🎉
        </div>
      )}
    </div>
  )
}