import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { List, User } from 'lucide-react' // 🔄 Заменили Download на User

interface NavbarProps {
  totalCount: number
  learnedCount: number
}

export default function Navbar({ totalCount, learnedCount }: NavbarProps) {
  const navigate = useNavigate()

  const progress = totalCount === 0 ? 0 : (learnedCount / totalCount) * 100

  return (
    <>
      <div className="flex items-start gap-5 p-5 w-full">
        {/* Кнопка "список слов" */}
        <button
          onClick={() => navigate('/words')}
          className="flex w-[64px] h-[64px] flex-col justify-center items-center gap-2 rounded-[20px] bg-white/10"
        >
          <List className="w-6 h-6 text-white/60" />
        </button>

        {/* Заголовок, счётчик и прогресс-бар */}
        <div className="flex flex-col justify-center items-start gap-1 flex-1 pt-2">
          <h1 className="text-white text-[24px] font-light leading-[22px]">
            Изучение слов
          </h1>
          <p className="text-white/80 text-[14px] font-thin leading-[22px] pt-1">
            выучено {learnedCount}/{totalCount}
          </p>
        </div>

        {/* Кнопка "профиль" */}
        <button
          onClick={() => navigate('/profile')} // 🔑 переход на страницу профиля
          className="flex w-[64px] h-[64px] flex-col justify-center items-center gap-2 rounded-[20px] bg-white/10"
        >
          <User className="w-6 h-6 text-white/60" />
        </button>
      </div>
    </>
  )
}
