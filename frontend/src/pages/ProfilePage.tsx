import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="p-5 text-white">
      <h2 className="text-xl mb-4">👤 Профиль</h2>
      <p className="mb-4">Вы вошли как <strong>{user}</strong></p>
      <button
        onClick={() => {
          logout()
          navigate('/')
        }}
        className="bg-white/10 px-4 py-2 rounded"
      >
        Выйти
      </button>
    </div>
  )
}
