import { TasksRepository } from '@/app/repositories/tasks-repository.js'
import { CreateTaskUseCase } from '../create-task.js'

export function makeCreateTaskUseCase() {
  const tasksRepository = new TasksRepository()
  const useCase = new CreateTaskUseCase(tasksRepository)
  return useCase
}
