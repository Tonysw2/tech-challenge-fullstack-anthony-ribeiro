import axios from 'axios'
import { storageKeys } from '@/config/storage-keys'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(storageKeys.accessToken)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
