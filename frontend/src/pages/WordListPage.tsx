import { useEffect, useState } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { ChevronRight, Download } from 'lucide-react'
import { api } from '@/utils/api'
import CSVUploadModal from '@/components/CSVUploadModal'

import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from 'react-swipeable-list'
import 'react-swipeable-list/dist/styles.css'

interface Word {
  id: number
  word: string
  translation: string
  learned: boolean
}

export default function WordListPage() {
  const [words, setWords] = useState<Word[]>([])
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialFilter = (searchParams.get('filter') as 'all' | 'learned' | 'unlearned') || 'all'
  const [filter, setFilter] = useState<'all' | 'learned' | 'unlearned'>(initialFilter)

  const handleFilterChange = (value: 'all' | 'learned' | 'unlearned') => {
    setFilter(value)
    setSearchParams({ filter: value })
  }

  useEffect(() => {
    api
      .get('/words')
      .then((res) => {
        const validWords = res.data.filter((w: any) => typeof w.id === 'number')
        setWords(validWords)
      })
      .catch(() => setError('Не удалось загрузить слова.'))
  }, [location])

  const filteredWords = words.filter((word) => {
    if (filter === 'learned') return word.learned
    if (filter === 'unlearned') return !word.learned
    return true
  })

  const handleDeleteWord = async (id: number) => {
    try {
      await api.delete(`/words/${id}`)
      setWords((prev) => prev.filter((w) => w.id !== id))
    } catch (err) {
      console.error('❌ Ошибка при удалении:', err)
    }
  }

  const trailingActions = (id: number) => (
    <TrailingActions>
      <SwipeAction destructive>
        <button
          onClick={() => handleDeleteWord(id)}
          className="bg-red-600 w-full h-full flex items-center justify-center px-4 py-2 rounded-l-lg text-sm text-white"
        >
          Удалить
        </button>
      </SwipeAction>
    </TrailingActions>
  )

  return (
    <div className="min-h-screen bg-black flex flex-col text-white">
      {/* 🔝 Хэдер */}
      <div className="flex items-start gap-5 p-5 w-full bg-black sticky top-0 z-10">
        <div className="flex flex-col justify-center items-start gap-1 pt-2 px-2 flex-1">
          <h1 className="text-[24px] font-light leading-[22px]">Мой словарь</h1>
          <p className="text-[14px] font-light leading-[22px] pt-2 text-white/80">
            У меня {words.length} слов
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="w-16 h-16 rounded-[20px] bg-white/10 active:bg-white/20 flex justify-center items-center"
        >
          <ChevronRight className="w-6 h-6 text-white/60" />
        </button>
      </div>

      {/* ⚠️ Ошибка */}
      {error && <div className="px-5 py-2 text-red-500 text-sm">{error}</div>}

      {/* 🔘 Таб-фильтр */}
      <div className="flex flex-col gap-5 px-5 pb-8 pt-5 overflow-y-auto">
        <div className="flex w-full gap-2 bg-white/5 pt-1 px-1 py-1 pb-1 rounded-[16px]">
          {[
            { label: 'Все', value: 'all' },
            { label: 'В изучении', value: 'unlearned' },
            { label: 'Выученные', value: 'learned' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleFilterChange(tab.value as typeof filter)}
              className={`h-10 px-4 flex-1 flex justify-center items-center text-[16px] font-light leading-[22px] rounded-[12px] ${
                filter === tab.value ? 'bg-white/10' : 'bg-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 📄 Список слов со свайпом */}
        <SwipeableList threshold={0.25} fullSwipe={false} className="pl-3">
          {filteredWords.map((word) => (
            <SwipeableListItem
              key={word.id}
              trailingActions={trailingActions(word.id)}
              swipeLeft={{
                content: null, // ❗️отключаем выталкивание карточки
                action: () => {}, // ❗️ничего не делаем при свайпе
              }}
            >
              <div
                onClick={() => navigate(`/words/${word.id}/edit`)}
                className="flex h-16 justify-between items-center w-full cursor-pointer rounded-xl transition px-4"
              >
                <div className="flex flex-col justify-center items-start gap-[2px] flex-1">
                  <span className="text-[16px] font-light leading-[22px]">{word.word}</span>
                  <span className="text-[14px] font-light leading-[22px] text-white/80">
                    {word.learned ? 'Выучено' : 'На изучении'}
                  </span>
                </div>
                <ChevronRight className="w-6 h-6 text-white/60" />
              </div>
            </SwipeableListItem>
          ))}
        </SwipeableList>
      </div>

      {/* ➕ Кнопки снизу */}
      <div className="sticky bottom-0 bg-black w-full px-5 pb-6 pt-3 flex gap-2">
        <button
          onClick={() => setModalOpen(true)}
          className="w-1/3 h-14 flex justify-center items-center gap-2 rounded-[20px] bg-white/10 active:bg-white/20 text-white text-[16px] font-medium"
        >
          <Download className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate('/edit/new')}
          className="flex-1 h-14 rounded-[20px] bg-white/10 active:bg-white/20 text-white text-[16px] font-medium"
        >
          Добавить слово
        </button>
      </div>

      {/* 📦 Модалка загрузки CSV */}
      <CSVUploadModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
