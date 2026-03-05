import { queryOptions } from '@tanstack/react-query'
import { getProfile } from '@/services/auth/get-profile'

export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
}

export const authQueries = {
  profile: () =>
    queryOptions({
      queryKey: authKeys.profile(),
      queryFn: getProfile,
      retry: false,
    }),
}
