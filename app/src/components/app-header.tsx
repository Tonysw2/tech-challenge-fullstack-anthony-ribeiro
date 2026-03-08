import { LogOutIcon, MoreHorizontal, User2Icon } from 'lucide-react'
import { useAuth } from '@/providers/auth-provider'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function AppHeader() {
  const { user, signOut } = useAuth()

  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="font-bold text-3xl -tracking-wider">Tasks</h1>
        <small className="text-muted-foreground">Manage your tasks</small>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          side="left"
          align="start"
          sideOffset={8}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <div className="flex size-8 items-center justify-center rounded-lg bg-secondary">
                <User2Icon className="size-5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="truncate text-muted-foreground text-xs">
                  {user?.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive" onClick={signOut}>
              <LogOutIcon /> Logout
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
