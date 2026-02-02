import z from 'zod'

export const signinSchema = z.object({
  email: z.email({ error: 'Enter Valid Email' }),
  password: z.string().min(1, 'Password is required'),
})
export const signupSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.email({ error: 'Enter Valid Email' }),
    password: z.string().min(8, 'Password is required 8 chart'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type SignIn = z.infer<typeof signinSchema>
export type SignUp = z.infer<typeof signupSchema>
