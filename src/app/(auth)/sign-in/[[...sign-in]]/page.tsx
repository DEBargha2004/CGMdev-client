'use client'

import { SignInSchema, SignInSchemaType } from '@/schema/sign-in'
import { ServerMessage } from '@/types/server-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { Close, Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Snackbar } from '@mui/joy'
import Link from 'next/link'

export default function SignIn () {
  const [showPassword, setShowPassword] = useState(false)
  const [snackBar, setSnackBar] = useState({
    open: false,
    status: '',
    title: '',
    description: ''
  })

  const [loading, setLoading] = useState({
    form_submitting: false
  })

  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema)
  })

  const handleFormSubmit = async (e: SignInSchemaType) => {
    console.log(e)
    setLoading(prev => ({ ...prev, form_submitting: true }))
    let rawResponse = await fetch('http://localhost:3000/sign-in', {
      method: 'POST',
      body: JSON.stringify({
        email: e.email,
        password: e.password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    let resp = (await rawResponse.json()) as ServerMessage
    setLoading(prev => ({ ...prev, form_submitting: false }))
    if (resp.status === 'error') {
      setSnackBar({
        open: true,
        status: 'error',
        title: resp.title,
        description: resp.description
      })
    } else {
      localStorage.setItem('token', resp.result.token)
      window.location.href = '/dashboard'
    }
  }
  return (
    <main className='form-page-container'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '400px'
        }}
      >
        <Typography sx={{ marginY: 2 }} fontSize={24}>
          Sign In
        </Typography>
        <form
          style={{ width: '100%' }}
          onSubmit={form.handleSubmit(handleFormSubmit)}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <TextField
              {...form.register('email')}
              placeholder='Email'
              type='email'
              label='Email'
              id='email'
              error={Boolean(form.formState.errors.email?.message)}
              sx={{
                width: 1,
                marginY: 1
              }}
              helperText={form.formState.errors.email?.message}
            />

            <TextField
              {...form.register('password')}
              placeholder='Password'
              type={showPassword ? 'text' : 'password'}
              label='Password'
              id='password'
              variant='outlined'
              error={Boolean(form.formState.errors.password?.message)}
              sx={{
                width: 1,
                marginY: 1
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => setShowPassword(prev => !prev)}
                      edge='end'
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              helperText={form.formState.errors.password?.message}
            />

            <Button
              sx={{ width: 1 }}
              variant='contained'
              type='submit'
              disabled={loading.form_submitting}
            >
              {loading.form_submitting ? 'Loading...' : 'Sign In'}
            </Button>
          </Box>
        </form>
        <Box
          sx={{
            marginY: 3
          }}
        >
          <Link href='/sign-up'>Don't have an account? Sign Up</Link>
        </Box>
        <Snackbar
          open={snackBar.open}
          autoHideDuration={3000}
          variant='solid'
          color={snackBar.status === 'error' ? 'danger' : 'success'}
          onClose={() =>
            setSnackBar({
              ...snackBar,
              open: false
            })
          }
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Box sx={{ width: 1 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: 1
              }}
            >
              <Typography fontSize={20}>{snackBar.title}</Typography>
              <Button
                variant='outlined'
                onClick={() => setSnackBar({ ...snackBar, open: false })}
              >
                <Close sx={{ p: 0 }} />
              </Button>
            </Box>
            <Typography>{snackBar.description}</Typography>
          </Box>
        </Snackbar>
      </Box>
    </main>
  )
}
