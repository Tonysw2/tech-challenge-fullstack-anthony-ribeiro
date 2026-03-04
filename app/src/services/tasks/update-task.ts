import type { Task, TaskStatus } from '@/entities/task'
import { httpClient } from '@/services/http-client'

export interface UpdateTaskRequest {
  title?: string
  description?: string | null
  status?: TaskStatus
}

export interface UpdateTaskResponse {
  task: Task
}

export async function updateTask(
  id: string,
  { title, description, status }: UpdateTaskRequest,
) {
  const { data } = await httpClient.patch<UpdateTaskResponse>(`/tasks/${id}`, {
    title,
    description,
    status,
  })
  return data
}
