import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { authMutations } from '@/mutations/auth.mutations'
import { useAuth } from '@/providers/auth-provider'
import { type SignInFormData, signInSchema } from './sign-in.schema'

export function useSignInController() {
  const { authenticate } = useAuth()

  const form = useForm<SignInFormData>({
    // @ts-ignore
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  const { mutateAsync: signInFn } = useMutation(authMutations.signIn())

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const { accessToken, refreshToken } = await signInFn({
        email: data.email,
        password: data.password,
      })
      authenticate(accessToken, refreshToken)
    } catch (error) {
      if (isAxiosError(error)) {
        const code = error.response?.data?.code
        if (code === 'INVALID_CREDENTIALS') {
          toast.error('Invalid email or password.')
          return
        }
      }
      toast.error('Something went wrong. Please try again.')
    }
  })

  return { form, onSubmit, isSubmitting: form.formState.isSubmitting }
}
