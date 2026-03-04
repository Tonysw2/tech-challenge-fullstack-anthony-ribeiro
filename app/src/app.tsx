import { RouterProvider } from 'react-router'
import { storageKeys } from './config/storage-keys'
import { TanstackQueryProvider } from './providers/tanstack-query-provider'
import { ThemeProvider } from './providers/theme-provider'
import { router } from './routes'

export default function App() {
  return (
    <TanstackQueryProvider>
      <ThemeProvider defaultTheme="system" storageKey={storageKeys.theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </TanstackQueryProvider>
  )
}
