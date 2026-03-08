import { TasksRepository } from '@/app/repositories/tasks-repository.js'
import { ListTasksUseCase } from '../list-tasks.js'

export function makeListTasksUseCase() {
  const tasksRepository = new TasksRepository()
  const useCase = new ListTasksUseCase(tasksRepository)
  return useCase
}
