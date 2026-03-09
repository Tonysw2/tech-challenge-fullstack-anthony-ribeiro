import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { AppHeader } from '@/components/app-header'
import { TaskList } from '@/components/task-list'
import { TaskListError } from '@/components/task-list-error'
import { TaskListSkeleton } from '@/components/task-list-skeleton'

export function HomePage() {
  return (
    <div className="mx-auto flex h-svh w-full max-w-lg flex-col px-4 py-6 md:px-6 md:py-10">
      <AppHeader />

      <main className="mt-6 flex min-h-0 flex-1 flex-col overflow-hidden md:mt-10">
        <ErrorBoundary fallback={<TaskListError />}>
          <Suspense fallback={<TaskListSkeleton />}>
            <TaskList />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}
