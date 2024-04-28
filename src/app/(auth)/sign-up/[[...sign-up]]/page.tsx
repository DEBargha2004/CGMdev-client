'use client'

import { SignUpSchema, SignUpSchemaType } from '@/schema/sign-up'
import { ServerMessage } from '@/types/server-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { Close, Visibility, VisibilityOff } from '@mui/icons-material'
import { Snackbar } from '@mui/joy'
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'
import { register } from 'module'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function SignUp () {
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema)
  })
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirm_password: false
  })

  const [snackBar, setSnackBar] = useState({
    open: false,
    status: '',
    title: '',
    description: ''
  })

  const [loading, setLoading] = useState({
    form_submitting: false
  })

  const handleFormSubmit = async (e: SignUpSchemaType) => {
    setLoading(prev => ({ ...prev, form_submitting: true }))
    const rawResponse = await fetch('http://localhost:3000/sign-up', {
      method: 'POST',
      body: JSON.stringify(e),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const resp = (await rawResponse.json()) as ServerMessage
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
          //   height: '100vh',
          width: '400px'
        }}
      >
        <Typography fontSize={24} marginY={2}>
          Sign Up
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
              {...form.register('first_name')}
              sx={{ width: 1, marginY: 1 }}
              label='First Name'
              id='first_name'
              error={Boolean(form.formState.errors.first_name)}
              helperText={form.formState.errors.first_name?.message}
            />
            <TextField
              {...form.register('last_name')}
              sx={{ width: 1, marginY: 1 }}
              label='Last Name'
              id='last_name'
              error={Boolean(form.formState.errors.last_name)}
              helperText={form.formState.errors.last_name?.message}
            />
            <TextField
              {...form.register('email')}
              sx={{ width: 1, marginY: 1 }}
              label='Email'
              id='email'
              type='email'
              error={Boolean(form.formState.errors.email)}
              helperText={form.formState.errors.email?.message}
            />
            <TextField
              {...form.register('password')}
              placeholder='Password'
              type={showPasswords.password ? 'text' : 'password'}
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
                      onClick={() =>
                        setShowPasswords(prev => ({
                          ...prev,
                          password: !prev.password
                        }))
                      }
                      edge='end'
                    >
                      {showPasswords.password ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              helperText={form.formState.errors.password?.message}
            />
            <TextField
              {...form.register('confirm_password')}
              placeholder='Confirm Password'
              type={showPasswords.confirm_password ? 'text' : 'password'}
              label='Confirm Password'
              id='confirm_password'
              variant='outlined'
              error={Boolean(form.formState.errors.confirm_password?.message)}
              sx={{
                width: 1,
                marginY: 1
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() =>
                        setShowPasswords(prev => ({
                          ...prev,
                          confirm_password: !prev.confirm_password
                        }))
                      }
                      edge='end'
                    >
                      {showPasswords.confirm_password ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              helperText={form.formState.errors.confirm_password?.message}
            />
            <TextField
              {...form.register('phone_number')}
              sx={{ width: 1, marginY: 1 }}
              label='Phone Number'
              id='phone_number'
              error={Boolean(form.formState.errors.phone_number)}
              helperText={form.formState.errors.phone_number?.message}
            />
            <TextField
              {...form.register('user_name')}
              sx={{ width: 1, marginY: 1 }}
              label='User Name'
              id='user_name'
              error={Boolean(form.formState.errors.user_name)}
              helperText={form.formState.errors.user_name?.message}
            />
            <Button
              variant='contained'
              type='submit'
              sx={{ width: 1, marginY: 1 }}
              disabled={loading.form_submitting}
            >
              {loading.form_submitting ? 'Loading...' : 'Sign Up'}
            </Button>
          </Box>
        </form>
        <Box
          sx={{
            marginY: 3
          }}
        >
          <Link href='/sign-in'>Already have an account? Sign In</Link>
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
