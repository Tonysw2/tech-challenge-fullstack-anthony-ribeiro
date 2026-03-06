import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { taskQueries } from '@/queries/tasks.queries'
import { CreateTaskDialog } from './create-task-dialog'
import { TaskCard } from './task-card'
import { Button } from './ui/button'

export function TaskList() {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(taskQueries.infiniteList({ limit: 10 }))

  const tasks = data.pages.flatMap((p) => p.tasks)
  const count = data.pages[0]?.meta.count ?? 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">{count} tasks</span>
        <CreateTaskDialog />
      </div>

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
