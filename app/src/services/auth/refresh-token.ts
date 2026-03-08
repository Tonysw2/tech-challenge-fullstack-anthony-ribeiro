import { httpClient } from '@/services/http-client'

interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export async function refreshToken(
  token: string,
): Promise<RefreshTokenResponse> {
  const { data } = await httpClient.post<RefreshTokenResponse>(
    '/refresh-token',
    {
      refreshToken: token,
    },
  )
  return data
}
