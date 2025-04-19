import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  token: string | null
  setToken: (token: string | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('token')
    if (stored) setTokenState(stored)
  }, [])

  const setToken = (token: string | null) => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
    setTokenState(token)
  }

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
