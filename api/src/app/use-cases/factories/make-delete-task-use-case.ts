import { TasksRepository } from '@/app/repositories/tasks-repository.js'
import { DeleteTaskUseCase } from '../delete-task.js'

export function makeDeleteTaskUseCase() {
  const tasksRepository = new TasksRepository()
  return new DeleteTaskUseCase(tasksRepository)
}
