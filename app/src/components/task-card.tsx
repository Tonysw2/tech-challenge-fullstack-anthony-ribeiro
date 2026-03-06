import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Task } from '@/entities/task'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(task.updatedAt))

  const isComplete = task.status === 'COMPLETE'

  return (
    <Card className="py-3">
      <CardContent className="flex items-center gap-4 px-3">
        <Checkbox checked={isComplete} />

        <div className="flex grow flex-col">
          <span className="font-semibold">{task.title}</span>
          <span className="text-muted-foreground text-sm">
            {task.description ? task.description : '-'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isComplete ? 'complete' : 'pending'}>
            {isComplete ? 'Complete' : 'Pending'}
          </Badge>

          <span className="whitespace-nowrap text-muted-foreground text-xs">
            Due {formattedTime}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" size="icon" variant="ghost">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
