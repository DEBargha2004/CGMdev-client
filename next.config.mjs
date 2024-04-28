/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'res.cloudinary.com'
      },
      {
        hostname: 'cdn-icons-png.flaticon.com'
      }
    ]
  }
}

export default nextConfig
