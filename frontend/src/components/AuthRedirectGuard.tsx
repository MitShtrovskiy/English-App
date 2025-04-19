import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'


export default function AuthRedirectGuard({ component }: { component: JSX.Element }) {
  const { token } = useAuth()

  if (token) {
    return <Navigate to="/" />
  }

  return component
}
