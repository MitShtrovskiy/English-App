import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ReactComponent as ListIcon } from '@/assets/icons/list.svg'
import { ReactComponent as DownloadIcon } from '@/assets/icons/download.svg'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <div className="flex p-5 gap-5 w-full max-w-[440px] mx-auto">
      <Button
        className="w-16 h-16 flex justify-center items-center rounded-[20px] bg-white/10"
        onClick={() => navigate('/list')}
      >
        <ListIcon />
      </Button>

      <div className="flex flex-col justify-center flex-1 gap-1">
        <h1 className="text-[24px] font-light text-white leading-[22px]">Изучение слов</h1>
        <p className="text-sm text-white/80 font-extralight leading-[22px]">Выучено 2/40</p>
      </div>

      <Button
        className="w-16 h-16 flex justify-center items-center rounded-[20px] bg-white/10"
        onClick={() => alert('Загрузка нового слова')}
      >
        <DownloadIcon />
      </Button>
    </div>
  )
}