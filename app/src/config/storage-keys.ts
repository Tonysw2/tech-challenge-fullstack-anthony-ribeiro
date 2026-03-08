const APP_PREFIX = '@todo-interview' as const

export const storageKeys = {
  theme: `${APP_PREFIX}:theme`,
  accessToken: `${APP_PREFIX}:accessToken`,
  refreshToken: `${APP_PREFIX}:refreshToken`,
} as const
