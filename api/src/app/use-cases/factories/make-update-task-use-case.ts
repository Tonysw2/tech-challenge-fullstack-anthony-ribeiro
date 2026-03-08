import { TasksRepository } from '@/app/repositories/tasks-repository.js'
import { UpdateTaskUseCase } from '../update-task.js'

export function makeUpdateTaskUseCase() {
  const tasksRepository = new TasksRepository()
  const useCase = new UpdateTaskUseCase(tasksRepository)
  return useCase
}
