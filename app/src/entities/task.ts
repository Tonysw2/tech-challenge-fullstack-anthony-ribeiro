export type TaskStatus = 'PENDING' | 'COMPLETE'

export interface Task {
  id: string
  userId: string
  title: string
  description: string | null
  status: TaskStatus
  createdAt: string
  updatedAt: string
}
