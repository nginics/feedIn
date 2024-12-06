import { NextResponse, NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'
 
export async function middleware(request: NextRequest) {
    const token = await getToken({req: request})
    const url = request.nextUrl;
        
    if(token && (
        url.pathname.startsWith("/signin") ||
        url.pathname.startsWith("/signup") ||
        url.pathname.startsWith("/verify")
    )){
      const newUrl = new URL('/dashboard', url)
      return NextResponse.redirect(newUrl)
    }

    if(!token && url.pathname.startsWith("/dashboard")) {
      const newUrl = new URL('/signin', url)
      newUrl.searchParams.set("redirectFromMW", "true")
      return NextResponse.redirect(newUrl);
    }

    return NextResponse.next();
}
 
export const config = {
  matcher: [
    "/signin",
    "/signup",
	  "/dashboard",
    "/dashboard/(.*)",
    "/verify/(.*)",
  ],
}