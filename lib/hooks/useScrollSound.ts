import { initScroll } from "@/lib/audio/scroll"
import { useEffect, useRef } from "react"

export function useScrollSound() {
  const scrollSoundRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    initScroll(scrollSoundRef)
  }, [])

  return scrollSoundRef
}
