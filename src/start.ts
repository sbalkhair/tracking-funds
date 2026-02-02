// src/start.ts
import { redirect } from '@tanstack/react-router'
import { createMiddleware, createStart } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from './features/auth/auth'

const myGlobalMiddleware = createMiddleware({}).server(
  async ({ next, request }) => {
    const url = new URL(request.url)
    if (url.pathname.startsWith('/dashboard')) {
      const headers = getRequestHeaders()
      const session = await auth.api.getSession({ headers })

      if (!session) {
        throw redirect({ to: '/sign-in' })
      }
    }
    return next()
  },
)
export const startInstance = createStart(() => {
  return {
    requestMiddleware: [myGlobalMiddleware],
  }
})
