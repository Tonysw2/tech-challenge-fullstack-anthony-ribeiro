import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import { storageKeys } from '@/config/storage-keys'
import type { User } from '@/entities/user'
import { authQueries } from '@/queries/auth.queries'
import { refreshToken } from '@/services/auth/refresh-token'
import { httpClient } from '@/services/http-client'

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
  const authenticate = useCallback((token: string, refreshToken: string) => {
    localStorage.setItem(storageKeys.accessToken, token)
    localStorage.setItem(storageKeys.refreshToken, refreshToken)
    setIsSignedIn(true)
  }, [])

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

  useLayoutEffect(() => {
    const interceptorId = httpClient.interceptors.request.use((config) => {
      const accessToken = localStorage.getItem(storageKeys.accessToken)
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
      return config
    })

    return () => {
      httpClient.interceptors.request.eject(interceptorId)
    }
  }, [])

  useLayoutEffect(() => {
    let isRefreshing = false
    let queue: Array<{
      resolve: (token: string) => void
      reject: (error: unknown) => void
    }> = []

    const interceptorId = httpClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (
          error.response?.status !== 401 ||
          originalRequest._retry ||
          originalRequest.url?.includes('/refresh-token')
        ) {
          return Promise.reject(error)
        }

        const storedRefreshToken = localStorage.getItem(
          storageKeys.refreshToken,
        )
        if (!storedRefreshToken) {
          signOut()
          return Promise.reject(error)
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            queue.push({
              resolve: (newToken) => {
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                resolve(httpClient(originalRequest))
              },
              reject,
            })
          })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await refreshToken(storedRefreshToken)

          authenticate(newAccessToken, newRefreshToken)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          queue.forEach(({ resolve }) => {
            resolve(newAccessToken)
          })
          queue = []
          return httpClient(originalRequest)
        } catch (refreshError) {
          queue.forEach(({ reject }) => {
            reject(refreshError)
          })
          queue = []
          signOut()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      },
    )

    return () => {
      httpClient.interceptors.response.eject(interceptorId)
    }
  }, [authenticate, signOut])

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
