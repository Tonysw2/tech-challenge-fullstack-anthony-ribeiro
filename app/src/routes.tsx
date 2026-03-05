import { createBrowserRouter } from 'react-router'
import { AuthGuard } from './components/guards/auth-guard'
import { RootLayout } from './components/layout/root-layout'
import { HomePage } from './pages/home'
import { SignInPage } from './pages/sign-in'
import { SignUpPage } from './pages/sign-up/sign-up'

export const router = createBrowserRouter([
  {
    element: <AuthGuard type="public" />,
    children: [
      {
        element: <RootLayout />,
        children: [
          { path: 'sign-in', element: <SignInPage /> },
          { path: 'sign-up', element: <SignUpPage /> },
        ],
      },
    ],
  },
  {
    element: <AuthGuard type="private" />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
    ],
  },
])
