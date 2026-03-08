import { httpClient } from '@/services/http-client'

export async function deleteTask(id: string) {
  await httpClient.delete(`/tasks/${id}`)
}
