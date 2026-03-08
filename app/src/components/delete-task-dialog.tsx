import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
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

interface DeleteTaskDialogProps {
  task: Task
  onAnimationEnd: () => void
}

export function DeleteTaskDialog({
  task,
  onAnimationEnd,
}: DeleteTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(!!task)

  const { mutateAsync: deleteTask } = useMutation(taskMutations.remove())

  async function handleDelete() {
    try {
      await deleteTask(task.id)
      toast.success('Task deleted successfully')
      setIsOpen(false)
    } catch {
      toast.error('Failed to delete task')
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent
        onAnimationEnd={() => {
          if (!isOpen) {
            onAnimationEnd()
          }
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Task?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The task "{task?.title}" will be
            permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
