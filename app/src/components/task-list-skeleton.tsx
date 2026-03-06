import { Skeleton } from './ui/skeleton'

export function TaskListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i.toString()} className="h-16 rounded-xl" />
      ))}
    </div>
  )
}
