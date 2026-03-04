export interface UpdateTaskDTO {
  id: string
  userId: string
  title?: string
  description?: string | null
  status?: 'PENDING' | 'COMPLETE'
}
