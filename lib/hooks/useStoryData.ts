import { updateStore } from "@/store"
import axios from "axios"
import { useEffect } from "react"

export function useStoryData() {
  useEffect(() => {
    async function init() {
      try {
        const { story } = await axios.get("/api/story").then((res) => res.data)
        updateStore({ story })
      } catch (error) {
        console.error("Failed to load story", error)
      }
    }

    init()
  }, [])
}
