import { useMutation } from '@tanstack/react-query'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Task } from '@/entities/task'
import { taskMutations } from '@/mutations/tasks.mutations'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

interface TaskCardProps {
  task: Task
  onEditClick: (task: Task) => void
  onDeleteClick: (task: Task) => void
}

export function TaskCard({ task, onEditClick, onDeleteClick }: TaskCardProps) {
  const { mutateAsync: updateTask, isPending: isUpdatingTask } = useMutation(
    taskMutations.update(),
  )

  const isComplete = task.status === 'COMPLETE'

  async function handleToggleStatus() {
    try {
      await updateTask({
        id: task.id,
        status: isComplete ? 'PENDING' : 'COMPLETE',
      })
    } catch {
      toast.error('Failed to update task status')
    }
  }

  return (
    <>
      <Card className="py-3">
        <CardContent className="flex items-center gap-4 px-3">
          <Checkbox
            checked={isComplete}
            disabled={isUpdatingTask}
            onCheckedChange={handleToggleStatus}
          />

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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" size="icon" variant="ghost">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => onEditClick(task)}>
                  <Pencil className="size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => onDeleteClick(task)}
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
