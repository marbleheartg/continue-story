"use client"

import axiosInstance from "@/lib/api/config"
import clientErrorHandling from "@/lib/clientErrorsReporting"
import preloadImages from "@/lib/utils/preloadImages"
import { updateStore } from "@/store"
import sdk from "@farcaster/frame-sdk"
import { useEffect } from "react"
import Button from "./components/Button"
import Header from "./components/Header"
import Scroll from "./components/Scroll"

export default function Home() {
  useEffect(() => {
    ;(async function () {
      clientErrorHandling()

      const { user, client } = await sdk.context

      const capabilities = await sdk.getCapabilities()

      updateStore({ user, client, capabilities })

      await preloadImages(
        [
          "arrow.svg",
          "bg.jpg",
          "feather.svg",
          "info.svg",
          "like.png",
          "logo.png",
          "mute.png",
          "profile.png",
          "reload.png",
          "scroll.png",
          "scrolled.png",
          "volume.png",
        ].map(src => `/images/${src}`)
      )

      await sdk.actions.ready({ disableNativeGestures: true })

      try {
        const { token: session } = await sdk.quickAuth.getToken()
        updateStore({ session })
        await axiosInstance.post("/api/login").catch(() => {})
      } catch (error) {
        await sdk.actions.close()
      }
    })()
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
