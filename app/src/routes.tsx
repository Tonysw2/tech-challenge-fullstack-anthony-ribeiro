import { createBrowserRouter } from 'react-router'
import { RootLayout } from './components/layout/root-layout'
import { SignInPage } from './pages/sign-in'
import { SignUpPage } from './pages/sign-up/sign-up'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <SignUpPage /> },
      { path: 'login', element: <SignInPage /> },
      { path: 'signup', element: <SignUpPage /> },
    ],
  },
])
