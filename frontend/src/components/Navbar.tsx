import { useNavigate } from 'react-router-dom'
import { List, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-5
        px-5
        pt-[20px]
        pb-0
        w-full
        max-w-[440px]
        mx-auto
        z-50
        relative
      "
      style={{
        background: 'transparent', // ⛔️ Без фона, как в макете
      }}
    >
      {/* 🔙 Кнопка "Список слов" */}
      <button
        onClick={() => navigate('/list')}
        className="
          flex
          w-[64px]
          h-[64px]
          flex-col
          justify-center
          items-center
          gap-2.5
          rounded-[20px]
          bg-[rgba(255,255,255,0.12)]
        "
      >
        {/* ✅ Иконка списка слов */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
          <path
            d="M5.3635 20.4855L2.6371 7.65874..."
            fill="white"
            fillOpacity="0.6"
          />
        </svg>
      </button>

      {/* 📖 Заголовок и прогресс */}
      <div
        className="
          flex
          pt-[2px]
          flex-col
          justify-center
          items-start
          gap-[4px]
          flex-1
          self-stretch
        "
      >
        <div
          className="
            text-white
            text-[24px]
            font-[274]
            leading-[22px]
            font-['SF Pro']
          "
        >
          Изучение слов
        </div>
        <div
          className="
            text-[14px]
            text-white/80
            font-[200]
            leading-[22px]
            font-['SF Pro Text']
          "
        >
          {/* 🧠 Счётчик будет динамическим (выучено/всего) */}
          {/* Пример: выучено 3/40 */}
          {/* Подставляется через пропсы, можно сделать позже */}
          выучено 3/40
        </div>
      </div>

      {/* ⬇️ Кнопка загрузки слова */}
      <button
        onClick={() => navigate('/upload')}
        className="
          flex
          w-[64px]
          h-[64px]
          flex-col
          justify-center
          items-center
          gap-2.5
          rounded-[20px]
          bg-[rgba(255,255,255,0.12)]
        "
      >
        {/* ✅ Иконка загрузки */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
          <path
            d="M5.30865 12.3467V4.4662..."
            fill="white"
            fillOpacity="0.6"
          />
        </svg>
      </button>
    </div>
  )
}