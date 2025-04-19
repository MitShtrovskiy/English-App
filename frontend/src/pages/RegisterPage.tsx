import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/utils/api'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    try {
      // 👇 отправка запроса на регистрацию
      const res = await api.post('/auth/register', {
        username,
        email,
        password,
      })

      // ✅ если успех — сразу логиним пользователя
      login(res.data.token, res.data.username)
      navigate('/')
    } catch (err) {
      setError('Ошибка при регистрации. Попробуйте позже.')
    }
  }
useEffect(() => {
  console.log('🔧 RegisterPage монтируется')
}, [])
  
  return (
    <div className="p-5 text-white space-y-4 max-w-[400px] mx-auto">
      <h2 className="text-2xl">Регистрация</h2>

      <input
        type="text"
        placeholder="Имя пользователя"
        className="w-full p-2 bg-white/10 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 bg-white/10 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Пароль"
        className="w-full p-2 bg-white/10 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-white/10 py-2 rounded"
      >
        Зарегистрироваться
      </button>

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
}
