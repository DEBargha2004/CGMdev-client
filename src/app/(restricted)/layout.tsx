'use client'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { CurrentUserType, setCurrentUser, setCount } from '@/redux/slice/users'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Typography
} from '@mui/material'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Snackbar } from '@mui/joy'
import { Close } from '@mui/icons-material'
import { ServerMessage } from '@/types/server-message'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function Layout ({ children }: { children: React.ReactNode }) {
  const currentUser = useAppSelector(state => state.users.currentUser)
  const total_count = useAppSelector(state => state.users.usersCount)

  const searchParams = useSearchParams()

  const current_count = Number(searchParams.get('start_after'))

  const dispatch = useAppDispatch()
  const [dialogState, setDialogState] = useState({
    image: false
  })
  const [loading, setLoading] = useState({
    image_upload: false
  })

  const [localImage, setLocalImage] = useState<{
    imageSrc: string
    imageFile: File | Blob | null
  }>({
    imageSrc: '',
    imageFile: null
  })
  const [snackBar, setSnackBar] = useState({
    open: false,
    status: '',
    title: '',
    description: ''
  })

  const handleLogout = () => {
    localStorage.setItem('token', '')
    window.location.href = '/sign-in'
  }
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const reader = new FileReader()
      const file = e.target.files[0]
      reader.onloadend = () => {
        setLocalImage(prev => ({
          ...prev,
          imageSrc: reader.result as string,
          imageFile: file
        }))
      }
      reader.readAsDataURL(file)
    }
  }
  const handleDialogClose = () => {
    setDialogState({ image: false })
    setLocalImage(prev => ({ ...prev, imageSrc: '', imageFile: null }))
  }
  const handleImageUpload = async () => {
    try {
      setLoading(prev => ({ ...prev, image_upload: true }))
      const formData = new FormData()
      formData.append('image', localImage.imageFile!)
      const rawResponse = await fetch('http://localhost:3000/upload-image', {
        method: 'POST',
        body: formData,
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const resp = (await rawResponse.json()) as ServerMessage<string>
      setLoading(prev => ({ ...prev, image_upload: false }))
      if (resp.status === 'success') {
        setDialogState(prev => ({ ...prev, image: false }))
        dispatch(
          setCurrentUser({ ...currentUser, image_public_id: resp.result! })
        )
        setLocalImage(prev => ({ ...prev, imageSrc: '', imageFile: null }))
      }
      setSnackBar(prev => ({
        ...prev,
        open: true,
        status: resp.status,
        title: resp.title,
        description: resp.description
      }))
    } catch (error) {
      setLoading(prev => ({ ...prev, image_upload: false }))
      setDialogState(prev => ({ ...prev, image: false }))
      setLocalImage(prev => ({ ...prev, imageSrc: '', imageFile: null }))
      setSnackBar(prev => ({
        ...prev,
        open: true,
        status: 'error',
        title: 'Internal Server Error',
        description: 'Something went wrong. Please try again later.'
      }))
    }
  }

  useEffect(() => {
    fetch('http://localhost:3000/current-user', {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(res => {
        console.log(res)
        dispatch(setCurrentUser(res.user_info))
      })
  }, [])

  useEffect(() => {
    fetch('http://localhost:3000/count', {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          dispatch(setCount(Number(res.result)))
        }
      })
  }, [])

  return (
    <div>
      <Box
        padding={2}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Button onClick={handleLogout} variant='contained'>
          Logout
        </Button>
        <Box
          display={'flex'}
          gap={2}
          justifyContent={'start'}
          alignItems={'center'}
        >
          <p>{currentUser?.email}</p>
          <Image
            src={
              currentUser?.image_public_id
                ? `https://res.cloudinary.com/djc2kwzus/image/upload/${currentUser?.image_public_id}`
                : `https://cdn-icons-png.flaticon.com/512/3405/3405423.png`
            }
            height={50}
            width={50}
            style={{
              borderRadius: '50%',
              cursor: 'pointer',
              objectFit: 'cover'
            }}
            alt='profile'
            onClick={() => setDialogState(prev => ({ ...prev, image: true }))}
          />
          <Dialog open={dialogState.image} onClose={handleDialogClose}>
            <DialogActions></DialogActions>
            <DialogTitle>
              <p>Profile</p>
            </DialogTitle>
            <DialogContent
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Image
                src={
                  localImage.imageSrc
                    ? localImage.imageSrc
                    : currentUser?.image_public_id
                    ? `https://res.cloudinary.com/djc2kwzus/image/upload/${currentUser?.image_public_id}`
                    : `https://cdn-icons-png.flaticon.com/512/3405/3405423.png`
                }
                height={100}
                width={100}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
                alt='profile'
              />
              <Input type='file' onChange={handleImageChange} />
              {localImage.imageSrc ? (
                <Button
                  variant='contained'
                  sx={{ width: 1 }}
                  disabled={loading.image_upload}
                  onClick={handleImageUpload}
                >
                  {loading.image_upload ? 'Uploading...' : 'Upload'}
                </Button>
              ) : null}
            </DialogContent>
          </Dialog>
        </Box>
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
      {children}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Link
          href={`/dashboard?start_after=${
            current_count - 10 < 0 ? 0 : current_count - 10
          }`}
        >
          <Button variant='contained' disabled={current_count === 0}>
            Prev
          </Button>
        </Link>
        <Link
          href={`/dashboard?start_after=${
            total_count < current_count + 10
              ? current_count
              : current_count + 10
          }`}
        >
          <Button
            variant='contained'
            disabled={total_count < current_count + 10}
          >
            Next
          </Button>
        </Link>
      </Box>
    </div>
  )
}
