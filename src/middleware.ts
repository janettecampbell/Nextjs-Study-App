import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie");
  const cookies = Object.fromEntries(
    cookieHeader?.split(";").map((cookie) => {
      const [name, value] = cookie.trim().split("=");
      return [name, value];
    }) || []
  );

  const token = cookies["token"];

  // If there's no token, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Make a request to the check endpoint to verify the token
  const res = await fetch(`${req.nextUrl.origin}/api/auth/check`, {
    method: "GET",
    headers: {
      cookie: `token=${token}`, // Send the token in the cookie header
    },
  });

  // If the response indicates the user is not authenticated, redirect to login
  if (!res.ok) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If the user is authenticated, allow access to the next page
  return NextResponse.next();
}

// Only apply to home and questions pages
export const config = {
  matcher: ["/home", "/questions"], // Specify protected routes
};
