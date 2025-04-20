import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/utils/api'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    try {
      const res = await api.post('/auth/register', { email, password })

      // ✅ сохраняем токен и email
      login(res.data.access_token, res.data.email)

      // ✅ подставляем токен в axios
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`

      navigate('/')
    } catch (err) {
      console.error('❌ Ошибка при регистрации:', err)
      setError('Ошибка при регистрации. Попробуйте позже.')
    }
  }

  return (
    <div className="p-5 text-white space-y-4 max-w-[400px] mx-auto">
      <h2 className="text-2xl">Регистрация</h2>

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