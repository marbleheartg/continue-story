import { FRAME, PROJECT_DESCRIPTION, PROJECT_TITLE } from "@/lib/constants"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://auth.farcaster.xyz" />
        <meta name="fc:frame" content={JSON.stringify(FRAME)} />
        <title>{PROJECT_TITLE}</title>
        <meta name="description" content={PROJECT_DESCRIPTION} />
        <link rel="icon" href="/images/logo.png" type="image/png" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
