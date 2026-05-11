import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://backend-finspend.vercel.app'

async function proxy(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params
  const search = req.nextUrl.search
  const url = `${BACKEND}/${path.join('/')}${search}`

  const headers = new Headers()
  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if (!['host', 'connection', 'transfer-encoding'].includes(lower)) {
      headers.set(key, value)
    }
  })

  let body: ArrayBuffer | undefined
  if (!['GET', 'HEAD'].includes(req.method)) {
    body = await req.arrayBuffer()
  }

  try {
    const res = await fetch(url, {
      method: req.method,
      headers,
      body: body ? Buffer.from(body) : undefined,
    })

    const responseHeaders = new Headers()
    res.headers.forEach((value, key) => {
      const lower = key.toLowerCase()
      if (!['content-encoding', 'transfer-encoding', 'connection'].includes(lower)) {
        responseHeaders.set(key, value)
      }
    })

    const data = await res.arrayBuffer()
    return new NextResponse(data, { status: res.status, headers: responseHeaders })
  } catch {
    return NextResponse.json({ success: false, message: 'Proxy error' }, { status: 502 })
  }
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const PATCH = proxy
export const DELETE = proxy
