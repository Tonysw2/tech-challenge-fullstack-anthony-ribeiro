import { createBrowserRouter } from 'react-router'
import { AuthGuard } from './components/guards/auth-guard'
import { RootLayout } from './components/layout/root-layout'
import { HomePage } from './pages/home'
import { SignInPage } from './pages/sign-in/sign-in'
import { SignUpPage } from './pages/sign-up/sign-up'

export const router = createBrowserRouter([
  {
    element: <AuthGuard type="public" />,
    children: [
      {
        Component: RootLayout,
        children: [
          {
            path: 'sign-in',
            Component: SignInPage,
          },
          {
            path: 'sign-up',
            Component: SignUpPage,
          },
        ],
      },
    ],
  },
  {
    element: <AuthGuard type="private" />,
    children: [
      {
        index: true,
        Component: HomePage,
      },
    ],
  },
])
