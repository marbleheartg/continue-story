"use client"

import useFarcasterAuth from "@/lib/hooks/useFarcasterAuth"
import Button from "./components/Button"
import Header from "./components/Header"
import Scroll from "./components/Scroll"

export default function Home() {
  useFarcasterAuth()

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
