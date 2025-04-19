import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function AuthRedirectGuard({ children }: { children: JSX.Element }) {
  const { token } = useAuth()

  if (token) {
    return <Navigate to="/" />
  }

  return children
}
