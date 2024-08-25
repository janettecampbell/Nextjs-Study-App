import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(request: Request) {
  // Get the 'cookie' header directly
  const cookieHeader = request.headers.get("cookie");

  // Parse the cookie header to get the token
  const cookies = cookieHeader?.split(";").reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split("=");
    acc[name] = value;
    return acc;
  }, {} as Record<string, string>);

  const token = cookies?.token;
  
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return NextResponse.json({ user: payload });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
