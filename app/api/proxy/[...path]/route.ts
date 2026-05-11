import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://backend-finspend.vercel.app'
const COOKIE_NAME = 'token'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60
const AUTH_PATHS = ['/auth/login', '/auth/register']
const LOGOUT_PATH = '/auth/logout'

async function proxy(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params
  const pathStr = '/' + path.join('/')
  const url = `${BACKEND}${pathStr}${req.nextUrl.search}`

  const headers = new Headers()
  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if (!['host', 'connection', 'transfer-encoding', 'cookie'].includes(lower)) {
      headers.set(key, value)
    }
  })

  // Inject token as Authorization header for protected routes
  const tokenCookie = req.cookies.get(COOKIE_NAME)
  if (tokenCookie?.value && !AUTH_PATHS.includes(pathStr)) {
    headers.set('Authorization', `Bearer ${tokenCookie.value}`)
  }

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

    const data = await res.arrayBuffer()

    // Extract token from login/register response to set httpOnly cookie
    let token: string | undefined
    if (res.ok && AUTH_PATHS.includes(pathStr)) {
      try {
        const json = JSON.parse(Buffer.from(data).toString())
        token = json?.data?.token
      } catch { /* ignore parse errors */ }
    }

    const responseHeaders = new Headers()
    res.headers.forEach((value, key) => {
      const lower = key.toLowerCase()
      if (!['content-encoding', 'transfer-encoding', 'connection', 'set-cookie'].includes(lower)) {
        responseHeaders.set(key, value)
      }
    })

    const response = new NextResponse(data, { status: res.status, headers: responseHeaders })

    if (token) {
      response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
        path: '/',
      })
    }

    if (pathStr === LOGOUT_PATH) {
      response.cookies.delete(COOKIE_NAME)
    }

    return response
  } catch {
    return NextResponse.json({ success: false, message: 'Proxy error' }, { status: 502 })
  }
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const PATCH = proxy
export const DELETE = proxy
