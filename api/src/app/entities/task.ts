export interface Task {
  id: string
  userId: string
  title: string
  description: string | null
  status: 'PENDING' | 'COMPLETE'
  createdAt: Date
  updatedAt: Date
}
