import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { storageKeys } from '@/config/storage-keys'
import { authMutations } from '@/mutations/auth.mutations'
import { type SignUpFormData, signUpSchema } from './sign-up.schema'

export function useSignUpController() {
  const navigate = useNavigate()

  const form = useForm<SignUpFormData>({
    // @ts-expect-error
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
      localStorage.setItem(storageKeys.accessToken, accessToken)
      localStorage.setItem(storageKeys.refreshToken, refreshToken)
      navigate('/sign-in')
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
