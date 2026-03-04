import { httpClient } from '@/services/http-client'

export interface SignUpRequest {
  name: string
  email: string
  password: string
}

export interface SignUpResponse {
  accessToken: string
  refreshToken: string
}

export async function signUp({ name, email, password }: SignUpRequest) {
  const { data } = await httpClient.post<SignUpResponse>('/sign-up', {
    name,
    email,
    password,
  })
  return data
}
