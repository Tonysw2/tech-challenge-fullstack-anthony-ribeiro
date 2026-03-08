import { AlertCircle } from 'lucide-react'

export function TaskListError() {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center text-muted-foreground">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="text-sm">Failed to load tasks. Please try again later.</p>
    </div>
  )
}
