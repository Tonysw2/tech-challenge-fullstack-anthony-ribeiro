import type { User } from '@/entities/user'
import { httpClient } from '@/services/http-client'

export interface GetProfileResponse {
  user: User
}

export async function getProfile() {
  const { data } = await httpClient.get<GetProfileResponse>('/me')
  return data
}
