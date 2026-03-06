import { infiniteQueryOptions } from '@tanstack/react-query'
import { type ListTasksRequest, listTasks } from '@/services/tasks/list-tasks'

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: ListTasksRequest) =>
    [...taskKeys.lists(), { ...filters }] as const,
}

export const taskQueries = {
  infiniteList: (filters: Omit<ListTasksRequest, 'cursor'> = {}) =>
    infiniteQueryOptions({
      initialPageParam: undefined as string | undefined,
      queryKey: taskKeys.list(filters),
      queryFn: ({ pageParam }) => listTasks({ ...filters, cursor: pageParam }),
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasMore
          ? (lastPage.meta.nextCursor ?? undefined)
          : undefined,
    }),
}
