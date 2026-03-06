import { mutationOptions } from '@tanstack/react-query'
import { queryClient } from '@/providers/tanstack-query-provider'
import { taskKeys } from '@/queries/tasks.queries'
import { createTask } from '@/services/tasks/create-task'
import { deleteTask } from '@/services/tasks/delete-task'
import {
  type UpdateTaskRequest,
  updateTask,
} from '@/services/tasks/update-task'

export const taskMutations = {
  create: () =>
    mutationOptions({
      mutationFn: createTask,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: taskKeys.all })
      },
    }),
  update: () =>
    mutationOptions({
      mutationFn: ({ id, ...data }: UpdateTaskRequest & { id: string }) =>
        updateTask(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: taskKeys.all })
      },
    }),
  remove: () =>
    mutationOptions({
      mutationFn: deleteTask,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: taskKeys.all })
      },
    }),
} as const
