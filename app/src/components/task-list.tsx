import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { taskQueries } from '@/queries/tasks.queries'
import { TaskCard } from './task-card'
import { Button } from './ui/button'

export function TaskList() {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(taskQueries.infiniteList({ limit: 10 }))

  const tasks = data.pages.flatMap((p) => p.tasks)

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}

      <div className="flex items-center justify-center">
        {hasNextPage && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage && <Loader2Icon className="animate-spin" />}
            Load more
          </Button>
        )}
      </div>
    </div>
  )
}
