'use client'

import { ServerMessage } from '@/types/server-message'
import { useEffect, useState } from 'react'

export default function Layout ({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch('http://localhost:3000/check-token', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then((res: ServerMessage) => {
        if (res.status === 'success') {
          window.location.href = '/dashboard'
        } else {
          setLoading(false)
        }
      })
  }, [])
  return <>{loading ? null : children}</>
}
