import { startAudio } from "@/lib/audio/background"
import { initPen } from "@/lib/audio/pen"
import { initScroll } from "@/lib/audio/scroll"
import { useEffect, useRef } from "react"

export function useStoryAudio() {
  const bgSoundRef = useRef<HTMLAudioElement | null>(null)
  const penSoundRef = useRef<HTMLAudioElement | null>(null)
  const scrollSoundRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    initPen(penSoundRef)
    const cleanup = startAudio(bgSoundRef)
    initScroll(scrollSoundRef)

    return () => {
      cleanup()
    }
  }, [])

  return { bgSoundRef, penSoundRef, scrollSoundRef }
}
