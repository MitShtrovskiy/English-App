import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { api } from '@/utils/api'
import { useLocation } from 'react-router-dom'


interface Word {
  id: number
  word: string
  translation: string
  learned: boolean
}

export default function WordListPage() {
  const [words, setWords] = useState<Word[]>([])
  const [filter, setFilter] = useState<'all' | 'learned' | 'unlearned'>('all')
  const navigate = useNavigate()

  // ⏬ Получение слов с бэка
  useEffect(() => {
    api.get('/words').then((res) => setWords(res.data))
  }, [])
  
  const location = useLocation()
  useEffect(() => {
    api.get('/words').then((res) => setWords(res.data))
  }, [location]) // 🔁 теперь обновляется при возврате на страницу
  

  // 🧠 Применение фильтра
  const filteredWords = words.filter((word) => {
    if (filter === 'learned') return word.learned
    if (filter === 'unlearned') return !word.learned
    return true
  })

  return (
    <div className="min-h-screen bg-black flex flex-col text-white">
      {/* 🔝 Хэдер (фиксирован) */}
      <div className="flex items-start gap-5 p-5 w-full bg-black sticky top-0 z-10">
        {/* Блок заголовка и счётчика */}
        <div className="flex flex-col justify-center items-start gap-1 pt-2 px-2 flex-1">
          <h1 className="text-[24px] font-light leading-[22px]">Мой словарь</h1>
          <p className="text-[14px] font-light leading-[22px] pt-2 text-white/80">
            У меня {words.length} слов
          </p>
        </div>

        {/* 🔙 Кнопка "назад" */}
        <button
          onClick={() => navigate(-1)}
          className="w-16 h-16 rounded-[20px] bg-white/10 active:bg-white/20 flex justify-center items-center"
        >
          <ChevronRight className="w-6 h-6 text-white/60" />
        </button>
      </div>

      {/* 📦 Контент с прокруткой */}
      <div className="flex flex-col gap-5 px-5 pb-8 pt-5 overflow-y-auto">
        {/* 🔘 Таб-фильтр */}
        <div className="flex w-full gap-2 bg-white/5 pt-1 px-1 py-1 pb-1 rounded-[16px]">
          {[
            { label: 'Все', value: 'all' },
            { label: 'В изучении', value: 'unlearned' },
            { label: 'Выученные', value: 'learned' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as typeof filter)}
              className={`h-10 px-4 flex-1 flex justify-center items-center text-[16px] font-light leading-[22px] rounded-[12px] ${
                filter === tab.value ? 'bg-white/10' : 'bg-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 📄 Список слов */}
        <div className="flex flex-col pl-3 gap-3">
          {filteredWords.map((word) => (
            <div
              key={word.id}
              onClick={() => navigate(`/words/${word.id}/edit`)}

              className="flex h-16 justify-between items-center w-full cursor-pointer rounded-xl transition"
            >
              {/* 🧾 Левая часть: слово и статус */}
              <div className="flex flex-col justify-center items-start gap-[2px] flex-1">
                <span className="text-[16px] font-light leading-[22px]">{word.word}</span>
                <span className="text-[14px] font-light leading-[22px] text-white/80">
                  {word.learned ? 'Выучено' : 'На изучении'}
                </span>
              </div>

              {/* ➡️ Иконка справа  */}
              <div className="w-16 h-16 flex justify-center items-center">
                <ChevronRight className="w-6 h-6 text-white/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}