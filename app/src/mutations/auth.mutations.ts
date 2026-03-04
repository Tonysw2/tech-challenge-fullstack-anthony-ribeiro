import { mutationOptions } from '@tanstack/react-query'
import { signIn } from '@/services/auth/sign-in'
import { signUp } from '@/services/auth/sign-up'

export const authMutations = {
  signUp: () => mutationOptions({ mutationFn: signUp }),
  signIn: () => mutationOptions({ mutationFn: signIn }),
}
