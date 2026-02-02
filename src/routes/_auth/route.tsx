import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="max-w-md mx-auto bg-white p-4 m-3 rounded-2xl">
      <Outlet />
    </div>
  )
}
