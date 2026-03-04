import { httpClient } from '@/services/http-client'

export interface SignInRequest {
  email: string
  password: string
}

export interface SignInResponse {
  accessToken: string
  refreshToken: string
}

export async function signIn({ email, password }: SignInRequest) {
  const { data } = await httpClient.post<SignInResponse>('/sign-in', {
    email,
    password,
  })

  return data
}
