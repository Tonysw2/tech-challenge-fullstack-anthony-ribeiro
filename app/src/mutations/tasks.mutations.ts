import { mutationOptions } from '@tanstack/react-query'
import { createTask } from '@/services/tasks/create-task'
import { deleteTask } from '@/services/tasks/delete-task'
import type { UpdateTaskRequest } from '@/services/tasks/update-task'
import { updateTask } from '@/services/tasks/update-task'

export const taskMutations = {
  create: () => mutationOptions({ mutationFn: createTask }),
  update: () =>
    mutationOptions({
      mutationFn: ({ id, ...body }: { id: string } & UpdateTaskRequest) =>
        updateTask(id, body),
    }),
  remove: () => mutationOptions({ mutationFn: deleteTask }),
}
