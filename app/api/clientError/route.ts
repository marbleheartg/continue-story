import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const fid = req.headers.get("fid")
  if (!fid) throw new Error("NoFID")

  try {
    const data = await req.json()

    console.error(JSON.stringify(data))

    return new NextResponse("Reporting client error", { status: 200 })
  } catch (err) {
    console.error(err)
    return new NextResponse("Reporting client error", { status: 500 })
  }
}
