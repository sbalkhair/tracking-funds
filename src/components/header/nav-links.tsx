import { authClient } from '@/features/auth/auth-client'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { Link, useNavigate } from '@tanstack/react-router'
import { buttonVariants } from '../ui/button'

const NavLinks = () => {
  const isMobile = useIsMobile()
  const { data } = authClient.useSession()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-start p-10 space-y-4  md:flex-row md:items-center md:p-0 md:space-y-0 gap-2">
      {!data?.user ? (
        <>
          <Link
            to="/sign-in"
            className={cn(!isMobile && buttonVariants({ variant: 'outline' }))}
          >
            SignIn
          </Link>
          <Link
            to="/sign-up"
            className={cn(!isMobile && buttonVariants({ variant: 'outline' }))}
          >
            SignUp
          </Link>
        </>
      ) : (
        <>
          <div
            className={cn(
              !isMobile && buttonVariants({ variant: 'outline' }),
              'cursor-pointer',
            )}
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  onSuccess: async () => {
                    navigate({ to: '/' })
                  },
                },
              })
            }
          >
            Logout
          </div>
          <Link
            to="/dashboard"
            className={cn(!isMobile && buttonVariants({ variant: 'outline' }))}
          >
            Dashboard
          </Link>
        </>
      )}
    </div>
  )
}

export default NavLinks
