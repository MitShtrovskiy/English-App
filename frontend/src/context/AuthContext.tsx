import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/utils/api' // 👈 обязательно импортировать, чтобы обновлять headers

interface AuthContextType {
  email: string | null
  token: string | null
  login: (token: string, email: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedEmail = localStorage.getItem('email')
    if (savedToken && savedEmail) {
      setToken(savedToken)
      setEmail(savedEmail)

      // 🧠 при монтировании — на всякий случай обновим headers
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
    }
  }, [])

  const login = (newToken: string, newEmail: string) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('email', newEmail)
    setToken(newToken)
    setEmail(newEmail)

    // 🛡️ Обновляем заголовки авторизации
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    setToken(null)
    setEmail(null)

    // 🧼 Удалим авторизационный заголовок
    delete api.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ email, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}