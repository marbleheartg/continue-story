import { create } from "zustand"

import { ClientContext, UserContext } from "@farcaster/frame-core/dist/context"
import { MiniAppHostCapability } from "@farcaster/frame-node"

type fid = number
type StoryPart = string

export type Story = {
  uuid: string
  parts: {
    fid: fid
    text: StoryPart
  }[]
  likes: fid[]
}

export type StoreData = {
  session?: string
  user?: UserContext
  client?: ClientContext
  capabilities?: MiniAppHostCapability[]
  story?: Story
  storyPart: StoryPart
  rules: { enabled: boolean; text: string }
  scrollOpen: boolean
  scrollVisible: boolean
  muted: boolean
  updateStore: (newState: Partial<StoreData> | ((prev: StoreData) => Partial<StoreData>)) => void
}

export const store = create<StoreData>(set => ({
  storyPart: "",
  rules: {
    enabled: true,
    text: `Write one sentence to spark a fun short story — the more creative, the better! The stories are limited to 5 sentences. One sentence — one author. Let’s have fun! ♡`,
  },
  scrollOpen: true,
  scrollVisible: false,
  muted: false,

  updateStore: newState =>
    set(prev => (typeof newState === "function" ? { ...prev, ...newState(prev) } : { ...prev, ...newState })),
}))

export const updateStore = store.getState().updateStore
