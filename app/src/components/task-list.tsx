import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { taskQueries } from '@/queries/tasks.queries'
import { CreateTaskDialog } from './create-task-dialog'
import { TaskCard } from './task-card'

export function TaskList() {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(taskQueries.infiniteList({ limit: 10 }))

  const tasks = data.pages.flatMap((p) => p.tasks)
  const count = data.pages[0]?.meta.count ?? 0

  const taskListContainerRef = useRef<HTMLDivElement>(null)
  const bottomTaskListTargetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!bottomTaskListTargetRef.current || !taskListContainerRef.current) {
      return
    }

    const observer = new IntersectionObserver(
      (entries, internalObserver) => {
        const { isIntersecting } = entries[0]

        if (!hasNextPage) {
          internalObserver.disconnect()
          return
        }

        if (isIntersecting && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        root: taskListContainerRef.current,
        rootMargin: '200px',
      },
    )

    observer.observe(bottomTaskListTargetRef.current)

    return () => {
      observer.disconnect()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between pb-4">
        <span className="text-muted-foreground text-sm">{count} tasks</span>
        <CreateTaskDialog />
      </div>

      <div
        ref={taskListContainerRef}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-4"
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {isFetchingNextPage && (
          <div className="flex justify-center py-2">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {hasNextPage && <div ref={bottomTaskListTargetRef} />}
      </div>
    </div>
  )
}
