import { useLocation } from 'react-router'
import { Separator } from './ui/separator'
import { SidebarTrigger } from './ui/sidebar'

const PAGE_NAMES: Record<string, string> = {
  '/': 'Tasks',
}

function getPageName(pathname: string): string {
  return (
    PAGE_NAMES[pathname] ??
    pathname
      .replace(/^\//, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  )
}

export function AppHeader() {
  const { pathname } = useLocation()

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="data-vertical:self-center! h-6"
      />
      <span className="font-medium">{getPageName(pathname)}</span>
    </header>
  )
}
