import { queryOptions } from '@tanstack/react-query'
import { type ListTasksRequest, listTasks } from '@/services/tasks/list-tasks'

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: ListTasksRequest) =>
    [...taskKeys.lists(), { ...filters }] as const,
}

export const taskQueries = {
  list: (filters: ListTasksRequest = {}) =>
    queryOptions({
      queryKey: taskKeys.list(filters),
      queryFn: () => listTasks(filters),
    }),
}
