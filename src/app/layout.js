import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ticketing Web',
  description: 'The Moment Group Ticketing Web',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='bg-gray-100'>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
