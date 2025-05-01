import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'OmniModel Dashboard',
  description: 'Scientific trust — anchored, on-chain.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
