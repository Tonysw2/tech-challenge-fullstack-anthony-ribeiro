import type { Task } from '@/entities/task'
import { httpClient } from '@/services/http-client'

export interface ListTasksRequest {
  cursor?: string
  limit?: number
}

export interface ListTasksResponse {
  tasks: Task[]
  meta: {
    nextCursor: string | null
    hasMore: boolean
    count: number
  }
}

export async function listTasks(params?: ListTasksRequest) {
  const { data } = await httpClient.get<ListTasksResponse>('/tasks', { params })
  return data
}
