import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { taskMutations } from '@/mutations/tasks.mutations'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Field, FieldError, FieldLabel } from './ui/field'
import { Input } from './ui/input'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false)

  const { mutateAsync: createTaskFn, isPending } = useMutation(
    taskMutations.create(),
  )

  const form = useForm<FormValues>({
    // @ts-ignore
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
    },
  })
  const formErrors = form.formState.errors

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const { task } = await createTaskFn(data)
      setOpen(false)
      form.reset()
      toast.success(`Task "${task.title}" created`)
    } catch {
      toast.error('Failed to create task')
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">New Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Field data-invalid={!!formErrors.title}>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              id="title"
              {...form.register('title')}
              aria-invalid={!!formErrors.title}
            />
            <FieldError errors={[formErrors.title]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Input id="description" {...form.register('description')} />
          </Field>
          <Button type="submit" disabled={isPending} className="self-end">
            {isPending ? 'Creating…' : 'Create'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
