import type { Task } from '@/entities/task'
import { httpClient } from '@/services/http-client'

export interface CreateTaskRequest {
  title: string
  description?: string
}

export interface CreateTaskResponse {
  task: Task
}

export async function createTask({ title, description }: CreateTaskRequest) {
  const { data } = await httpClient.post<CreateTaskResponse>('/tasks', {
    title,
    description,
  })
  return data
}
