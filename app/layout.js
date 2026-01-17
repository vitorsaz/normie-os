import './globals.css'

export const metadata = {
  title: 'NormieOS | Trading Bot Dashboard',
  description: 'AI-powered memecoin trading on Solana - For the normies, by the normies',
  openGraph: {
    title: 'NormieOS | Trading Bot Dashboard',
    description: 'AI-powered memecoin trading on Solana',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NormieOS | Trading Bot Dashboard',
    description: 'AI-powered memecoin trading on Solana',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
