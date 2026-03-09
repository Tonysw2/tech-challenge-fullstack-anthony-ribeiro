import { Outlet } from 'react-router'

export function RootLayout() {
  return (
    <div className="flex min-h-svh w-full items-start justify-center p-6 pt-12 md:items-center md:p-10">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  )
}
