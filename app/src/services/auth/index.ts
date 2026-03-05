import { getProfile } from './get-profile'
import { signIn } from './sign-in'
import { signUp } from './sign-up'

export const AuthService = {
  signIn,
  signUp,
  getProfile,
} as const
