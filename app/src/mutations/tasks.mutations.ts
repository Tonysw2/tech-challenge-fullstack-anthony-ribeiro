import { type InfiniteData, mutationOptions } from '@tanstack/react-query'
import { queryClient } from '@/providers/tanstack-query-provider'
import { taskKeys } from '@/queries/tasks.queries'
import { createTask } from '@/services/tasks/create-task'
import { deleteTask } from '@/services/tasks/delete-task'
import type { ListTasksResponse } from '@/services/tasks/list-tasks'
import {
  type UpdateTaskRequest,
  updateTask,
} from '@/services/tasks/update-task'

export const taskMutations = {
  create: () =>
    mutationOptions({
      mutationFn: createTask,
      onSuccess: (_task, _variables, _result, ctx) => {
        ctx.client.invalidateQueries({ queryKey: taskKeys.all })
      },
    }),
  update: () =>
    mutationOptions({
      mutationFn: ({ id, ...data }: UpdateTaskRequest & { id: string }) =>
        updateTask(id, data),
      onMutate: async (updatedTask, ctx) => {
        await ctx.client.cancelQueries({ queryKey: taskKeys.all })

        const previousTodos = ctx.client.getQueryData(taskKeys.list())

        ctx.client.setQueryData<InfiniteData<ListTasksResponse>>(
          taskKeys.list(),
          (old) => {
            if (!old) return old
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                tasks: page.tasks.map((task) =>
                  task.id === updatedTask.id
                    ? { ...task, ...updatedTask }
                    : task,
                ),
              })),
            }
          },
        )

        return { previousTodos }
      },
      onError: (_error, _updatedTask, onMutateResult, ctx) => {
        ctx.client.setQueryData(taskKeys.list(), onMutateResult?.previousTodos)
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
