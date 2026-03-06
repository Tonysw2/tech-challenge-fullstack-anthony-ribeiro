import { useMutation } from '@tanstack/react-query'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { UpdateTaskDialog } from './update-task-dialog'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const { mutateAsync: deleteTask } = useMutation(taskMutations.remove())
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

  async function handleDelete() {
    try {
      await deleteTask(task.id)
      toast.success('Task deleted successfully')
    } catch {
      toast.error('Failed to delete task')
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
                <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                  <Pencil className="size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => setDeleteOpen(true)}
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <UpdateTaskDialog
        task={task}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The task "{task.title}" will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
