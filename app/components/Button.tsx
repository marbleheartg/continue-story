import axiosInstance from "@/lib/api/config"
import delay from "@/lib/api/utils/delay"
import { initScroll } from "@/lib/audio/scroll"
import { store, updateStore } from "@/store"
import sdk from "@farcaster/frame-sdk"
import axios from "axios"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useShallow } from "zustand/react/shallow"

const Button = () => {
  const { storyPart, rules, scrollOpen } = store(
    useShallow((state) => ({ storyPart: state.storyPart, rules: state.rules, scrollOpen: state.scrollOpen }))
  )

  const disabled = !rules.enabled && (!scrollOpen || storyPart.length < 15)

  const scrollSoundRef = useRef<HTMLAudioElement | null>(null)

  const [count, setCount] = useState(0)

  useEffect(() => {
    initScroll(scrollSoundRef)
  }, [])

  async function handleClick() {
    const { client, muted, story, storyPart } = store.getState()

    if (count < 4) setCount(prev => prev + 1)

    try {
      if (count == 3 && !client?.added) await sdk.actions.addFrame()
      if (!muted) scrollSoundRef?.current?.play()
    } catch (error) {}

    try {
      updateStore({ scrollOpen: false })

      if (rules.enabled) {
        updateStore(prev => ({
          rules: { ...prev.rules, enabled: false },
        }))
      } else if (storyPart) {
        if (story?.uuid)
          await axiosInstance.post("/api/story", { uuid: story?.uuid, text: storyPart }).then(res => res.data)
        else throw new Error("Not enough data")

        const { story: newStory } = await axios.get("/api/story").then(res => res.data)

        updateStore({
          story: newStory,
          storyPart: "",
        })
      }
    } catch (error) {
    } finally {
      await delay(2000)
      updateStore({ scrollOpen: true })
    }
  }

  return (
    <div className="fixed bottom-15 left-5 right-5">
      <button
        className={`flex justify-center w-full max-w-xl mx-auto py-2.5 rounded-3xl transition-[background-color,opacity] duration-300 cursor-pointer ${
          disabled ? "bg-gray-300" : "bg-white"
        }`}
        onClick={handleClick}
        disabled={disabled}
      >
        {rules.enabled ? (
          <Image src="/images/arrow.png" alt="arrow" width={32} height={32} />
        ) : (
          <Image src="/images/feather.png" alt="feather" width={32} height={32} />
        )}
      </button>
    </div>
  )
}

export default Button
