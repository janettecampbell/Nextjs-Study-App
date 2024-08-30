import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    // Access the cookie header
    const cookieHeader = req.headers.get("cookie");
    console.log("cookieHeader:", cookieHeader);

    if (!cookieHeader) {
      return NextResponse.json({ message: "No cookies found" }, { status: 401 });
    }

    const cookies = Object.fromEntries(
      cookieHeader?.split(";").map((cookie) => {
        const [name, value] = cookie.trim().split("=");
        return [name, decodeURIComponent(value)];
      }) || []
    );

    const token = cookies["token"];

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log("decoded", decoded)

    await dbConnect();

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Ensure that the user object contains the _id and other necessary fields
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    return NextResponse.json({ user: userResponse }, { status: 200 });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
