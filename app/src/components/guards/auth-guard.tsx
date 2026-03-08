import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/providers/auth-provider'

export function AuthGuard({ type }: { type: 'private' | 'public' }) {
  const { isSignedIn } = useAuth()

  if (type === 'private' && !isSignedIn)
    return <Navigate to="/sign-in" replace />
  if (type === 'public' && isSignedIn) return <Navigate to="/" replace />

  return <Outlet />
}
