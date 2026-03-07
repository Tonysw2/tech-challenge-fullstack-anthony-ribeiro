import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import type { Task } from '@/entities/task'
import { taskMutations } from '@/mutations/tasks.mutations'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Field, FieldError, FieldLabel } from './ui/field'
import { Input } from './ui/input'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface UpdateTaskDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateTaskDialog({
  task,
  open,
  onOpenChange,
}: UpdateTaskDialogProps) {
  const { mutateAsync: updateTaskFn, isPending } = useMutation(
    taskMutations.update(),
  )

  const form = useForm<FormValues>({
    // @ts-ignore
    resolver: zodResolver(schema),
    defaultValues: {
      title: task.title,
      description: task.description ?? '',
    },
  })
  const { errors: formErrors, isDirty } = form.formState

  useEffect(() => {
    if (open) {
      form.reset({
        title: task.title,
        description: task.description ?? '',
      })
    }
  }, [open, task, form])

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const { task: updated } = await updateTaskFn({
        id: task.id,
        title: data.title,
        description: data.description || undefined,
      })
      onOpenChange(false)
      toast.success(`Task "${updated.title}" updated`)
    } catch {
      toast.error('Failed to update task')
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Field data-invalid={!!formErrors.title}>
            <FieldLabel htmlFor="edit-title">Title</FieldLabel>
            <Input
              id="edit-title"
              {...form.register('title')}
              aria-invalid={!!formErrors.title}
            />
            <FieldError errors={[formErrors.title]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="edit-description">Description</FieldLabel>
            <Input id="edit-description" {...form.register('description')} />
          </Field>
          <Button
            type="submit"
            disabled={isPending || !isDirty}
            className="self-end"
          >
            {isPending ? 'Saving…' : 'Save'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
