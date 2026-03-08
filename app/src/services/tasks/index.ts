import { createTask } from './create-task'
import { deleteTask } from './delete-task'
import { listTasks } from './list-tasks'
import { updateTask } from './update-task'

export const TasksService = {
  create: createTask,
  list: listTasks,
  update: updateTask,
  delete: deleteTask,
} as const
