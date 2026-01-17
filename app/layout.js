import './globals.css'

export const metadata = {
  title: 'NormieOS XP',
  description: 'For the normies, by the normies',
  openGraph: {
    title: 'NormieOS XP',
    description: 'For the normies, by the normies',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NormieOS XP',
    description: 'For the normies, by the normies',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
