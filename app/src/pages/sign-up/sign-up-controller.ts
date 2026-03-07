import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { authMutations } from '@/mutations/auth.mutations'
import { useAuth } from '@/providers/auth-provider'
import { type SignUpFormData, signUpSchema } from './sign-up.schema'

export function useSignUpController() {
  const { authenticate } = useAuth()

  const form = useForm<SignUpFormData>({
    // @ts-ignore
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const { mutateAsync: signUpFn } = useMutation(authMutations.signUp())

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const { accessToken, refreshToken } = await signUpFn({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      authenticate(accessToken, refreshToken)
    } catch (error) {
      if (isAxiosError(error)) {
        const code = error.response?.data?.code
        if (code === 'EMAIL_ALREADY_IN_USE') {
          toast.error('This email is already in use.')
          return
        }
      }
      toast.error('Something went wrong. Please try again.')
    }
  })

  return { form, onSubmit, isSubmitting: form.formState.isSubmitting }
}
