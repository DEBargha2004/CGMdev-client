import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Avatar ({
  image_public_id,
  ...props
}: {
  image_public_id: string | null | undefined
} & React.ComponentProps<typeof Image>) {
  return <Image height={50} width={50} src={``} alt='profile' {...props} />
}
