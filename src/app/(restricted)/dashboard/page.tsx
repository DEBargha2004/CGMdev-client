'use client'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { ServerMessage } from '@/types/server-message'
import { AspectRatio } from '@mui/joy'
import { Box, Button, Grid, Skeleton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { setUsers } from '@/redux/slice/users'
import Image from 'next/image'

export default function Dashboard () {
  const [loading, setLoading] = useState({
    users: true
  })

  const usersState = useAppSelector(state => state.users)
  const dispatch = useAppDispatch()

  useEffect(() => {
    ;(async () => {
      const rawResp = await fetch('http://localhost:3000/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      const res = (await rawResp.json()) as ServerMessage
      console.log(res.result)
      if (res.status === 'success') {
        dispatch(setUsers(res.result))
      } else {
        if (rawResp.status === 403) {
          window.location.href = '/sign-in'
        }
      }

      setLoading(prev => ({ ...prev, users: false }))
    })()
  }, [])

  console.log(usersState)

  return (
    <Grid container padding={4} gap={2}>
      {loading.users
        ? Array.from({ length: 12 }, (_, i) => i).map(i => (
            <Grid item xs={3} key={i} height={200}>
              <Skeleton height={200} />
            </Grid>
          ))
        : usersState.users.map(user => (
            <Grid
              item
              xs={3}
              key={user.user_id}
              height={200}
              //   border={1}
              borderRadius={3}
              bgcolor={'slateblue'}
              padding={2}
            >
              <Box
                marginBottom={2}
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
              >
                <Box color={'white'}>
                  <Typography fontSize={14} fontWeight={700} marginY={2}>
                    {user.user_name}
                  </Typography>
                  <Typography>{user.first_name}</Typography>
                </Box>
                <Box>
                  <Image
                    src={
                      user.image_public_id
                        ? `https://res.cloudinary.com/djc2kwzus/image/upload/${user.image_public_id}`
                        : `https://cdn-icons-png.flaticon.com/512/3405/3405423.png`
                    }
                    height={100}
                    width={100}
                    alt='profile'
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                </Box>
              </Box>
              <Button variant='contained'>Follow</Button>
            </Grid>
          ))}
    </Grid>
  )
}
