import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/auth-provider'

export function HomePage() {
  const { user, signOut } = useAuth()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-2xl">Welcome, {user?.name}</h1>
      <Button variant="outline" onClick={signOut} className="w-fit">
        Sign out
      </Button>
    </div>
  )
}
