import verifySession from "@/lib/api/utils/verifySession"
import { NextRequest, NextResponse } from "next/server"

const { NEXT_PUBLIC_HOST } = process.env
if (!NEXT_PUBLIC_HOST) throw new Error("NextConfigCredentialsNotConfigured")

export const config = {
  matcher: ["/api/:path*"],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/api")) return NextResponse.next()
  if (request.method === "GET") return NextResponse.next()

  const protectedRoutes = ["/api/login", "/api/like", "/api/story"]

  if (!protectedRoutes.includes(pathname)) return NextResponse.next()

  const authHeader = request.headers.get("authorization")

  if (!authHeader?.startsWith("Bearer "))
    return new NextResponse(JSON.stringify({ error: "Unauthorized: No token provided" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    })

  const session = authHeader.split(" ")[1]

  const fid = await verifySession(session)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("fid", fid.toString())

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}
