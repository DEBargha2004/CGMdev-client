import * as z from 'zod'

export const SignUpSchema = z
  .object({
    first_name: z
      .string({ required_error: 'First name is required' })
      .min(1, 'First name is required'),
    last_name: z
      .string({ required_error: 'Last name is required' })
      .min(1, 'Last name is required'),
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required'),
    confirm_password: z
      .string({ required_error: 'Confirm password is required' })
      .min(1, 'Confirm password is required'),
    phone_number: z
      .string({ required_error: 'Phone number is required' })
      .refine(
        data => {
          return data.length === 10
        },
        {
          message: 'Phone number must be 10 digits'
        }
      ),
    user_name: z
      .string({ required_error: 'User Name is required' })
      .min(1, 'User Name is required')
  })
  .refine(
    ({ confirm_password, password }) => {
      return confirm_password === password
    },
    {
      message: 'Passwords do not match',
      path: ['confirm_password']
    }
  )

export type SignUpSchemaType = z.infer<typeof SignUpSchema>
