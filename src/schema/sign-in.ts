import * as z from 'zod'

export const SignInSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
})

export type SignInSchemaType = z.infer<typeof SignInSchema>
