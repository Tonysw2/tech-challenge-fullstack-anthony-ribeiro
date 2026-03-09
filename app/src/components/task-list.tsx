import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { ClipboardList, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Task } from '@/entities/task'
import { taskQueries } from '@/queries/tasks.queries'
import { CreateTaskDialog } from './create-task-dialog'
import { DeleteTaskDialog } from './delete-task-dialog'
import { TaskCard } from './task-card'
import { ScrollArea } from './ui/scroll-area'
import { UpdateTaskDialog } from './update-task-dialog'

export function TaskList() {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(taskQueries.infiniteList({ limit: 10 }))

  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

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
        rootMargin: '100px',
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
        <span className="text-muted-foreground text-sm">
          {tasks.length} tasks of {count}
        </span>
        <CreateTaskDialog />
      </div>

      <ScrollArea
        className="min-h-0 flex-1 pr-2"
        viewportRef={taskListContainerRef}
      >
        <div className="flex flex-col gap-4 p-1">
          {tasks.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <ClipboardList className="size-10 opacity-40" />
              <p className="font-medium text-sm">No tasks yet</p>
              <p className="text-xs">Create your first task to get started.</p>
            </div>
          )}

          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEditClick={setTaskToEdit}
              onDeleteClick={setTaskToDelete}
            />
          ))}

          {isFetchingNextPage && (
            <div className="flex justify-center py-2">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {hasNextPage && <div ref={bottomTaskListTargetRef} />}
        </div>
      </ScrollArea>

      {taskToEdit && (
        <UpdateTaskDialog
          task={taskToEdit}
          onAnimationEnd={() => setTaskToEdit(null)}
        />
      )}

      {taskToDelete && (
        <DeleteTaskDialog
          task={taskToDelete}
          onAnimationEnd={() => setTaskToDelete(null)}
        />
      )}
    </div>
  )
}
