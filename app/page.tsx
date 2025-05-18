"use client"

import webhook from "@/lib/api/webhook"
import { login } from "@/lib/auth/login"
import { updateStore } from "@/store"
import { generateNonce } from "@farcaster/auth-client"
import sdk from "@farcaster/frame-sdk"
import { useEffect } from "react"
import Button from "./components/Button"
import Header from "./components/Header"
import Scroll from "./components/Scroll"

async function init() {
  const { user, client } = await sdk.context

  updateStore({
    user,
    client,
  })

  const nonce = generateNonce()

  await sdk.actions.ready({ disableNativeGestures: true })

  try {
    const { message, signature } = await sdk.actions.signIn({
      nonce,
    })

    console.log(message, signature, nonce)

    const { session } = await login(message, signature, nonce)

    updateStore({
      session,
    })
  } catch (error) {
    await sdk.actions.close()
  }

  sdk.on("frameAdded", async ({ notificationDetails }) => {
    if (notificationDetails?.token) {
      await webhook(notificationDetails.token)
    }
  })

  return () => {
    sdk.removeAllListeners()
  }
}

export default function Home() {
  useEffect(() => {
    init()
  }, [])

  return (
    <div onDragStart={e => e.preventDefault()}>
      <Header />
      <main>
        <Scroll />
        <Button />
      </main>
    </div>
  )
}
