import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { AppHeader } from '@/components/app-header'
import { TaskList } from '@/components/task-list'
import { TaskListError } from '@/components/task-list-error'
import { TaskListSkeleton } from '@/components/task-list-skeleton'

export function HomePage() {
  return (
    <div className="mx-auto flex h-svh w-full max-w-lg flex-col py-10">
      <AppHeader />

      <main className="mt-10 flex min-h-0 flex-1 flex-col overflow-hidden">
        <ErrorBoundary fallback={<TaskListError />}>
          <Suspense fallback={<TaskListSkeleton />}>
            <TaskList />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}
