import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { Suspense } from 'react'
import NavLinks from './header/nav-links'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

const Header = () => {
  return (
    <div className="border-b bg-white sticky top-0 z-50">
      <div className="flex items-center justify-between container py-4 px-5  mx-auto">
        <Link to="/">
          <div className="flex items-center gap-2">
            <div className="w-14">
              <img src="logo.png" />
            </div>
            <div className="font-bold text-2xl">Tracking Funds</div>
          </div>
        </Link>
        <nav className="hidden md:flex">
          <Suspense>
            <NavLinks />
          </Suspense>
        </nav>
        <Sheet>
          <SheetTrigger asChild className="flex md:hidden">
            <Menu />
          </SheetTrigger>
          <SheetContent>
            <Suspense>
              <NavLinks />
            </Suspense>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

export default Header
