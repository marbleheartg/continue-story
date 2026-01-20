import { FRAME, PROJECT_DESCRIPTION, PROJECT_TITLE } from "@/lib/constants"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: PROJECT_TITLE,
  description: PROJECT_DESCRIPTION,
  icons: {
    icon: "/images/logo.png",
  },
  other: {
    "fc:frame": JSON.stringify(FRAME),
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://auth.farcaster.xyz" />
        <meta name="base:app_id" content="696f52d6c0ab25addaaaf782" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
