import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { storageKeys } from '@/config/storage-keys'
import type { User } from '@/entities/user'
import { authQueries } from '@/queries/auth.queries'

interface AuthContextValue {
  user: User | undefined
  isSignedIn: boolean
  signOut: () => void
  authenticate: (accessToken: string, refreshToken: string) => void
}

const AuthContext = createContext({} as AuthContextValue)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient()
  const [isSignedIn, setIsSignedIn] = useState(() => {
    const token = localStorage.getItem(storageKeys.accessToken)
    return Boolean(token)
  })

  const { data, isFetching, isSuccess, isError } = useQuery({
    ...authQueries.profile(),
    enabled: !!isSignedIn,
  })

  const authenticate = useCallback(
    (accessToken: string, refreshToken: string) => {
      localStorage.setItem(storageKeys.accessToken, accessToken)
      localStorage.setItem(storageKeys.refreshToken, refreshToken)
      setIsSignedIn(true)
    },
    [],
  )

  const signOut = useCallback(() => {
    localStorage.removeItem(storageKeys.accessToken)
    localStorage.removeItem(storageKeys.refreshToken)
    setIsSignedIn(false)
    queryClient.removeQueries()
  }, [queryClient])

  useEffect(() => {
    if (isError || (isSuccess && !data?.user)) {
      signOut()
    }
  }, [data?.user, isError, isSuccess, signOut])

  return (
    <AuthContext.Provider
      value={{
        user: data?.user,
        isSignedIn: isSuccess && isSignedIn,
        signOut,
        authenticate,
      }}
    >
      {isFetching && (
        <div className="grid min-h-svh w-full place-content-center">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {!isFetching && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
