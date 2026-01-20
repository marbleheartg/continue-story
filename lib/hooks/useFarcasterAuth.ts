import axiosInstance from "@/lib/api/config"
import clientErrorHandling from "@/lib/clientErrorsReporting"
import { IMAGES_TO_PRELOAD } from "@/lib/constants"
import preloadImages from "@/lib/utils/preloadImages"
import { updateStore } from "@/store"
import sdk from "@farcaster/frame-sdk"
import { useEffect } from "react"

export default function useFarcasterAuth() {
  useEffect(() => {
    ;(async function () {
      clientErrorHandling()

      const { user, client } = await sdk.context

      const capabilities = await sdk.getCapabilities()

      updateStore({ user, client, capabilities })

      await preloadImages(IMAGES_TO_PRELOAD.map(src => `/images/${src}`))

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
}
