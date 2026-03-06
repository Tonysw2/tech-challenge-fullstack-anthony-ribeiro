import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { AppHeader } from '@/components/app-header'
import { TaskList } from '@/components/task-list'
import { TaskListError } from '@/components/task-list-error'
import { TaskListSkeleton } from '@/components/task-list-skeleton'

export function HomePage() {
  return (
    <div className="mx-auto mt-20 w-full max-w-lg">
      <AppHeader />

      <main className="mt-10">
        <ErrorBoundary fallback={<TaskListError />}>
          <Suspense fallback={<TaskListSkeleton />}>
            <TaskList />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}
