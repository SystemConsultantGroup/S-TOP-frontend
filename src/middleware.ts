import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JWT_COOKIE_NAME } from "./constants/Auth";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "./types/jwtPayload";

export function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const isApiRoute = pathname.startsWith("/v1");
  const isStaticFile =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon.ico");

  if (isApiRoute || isStaticFile) {
    return NextResponse.next();
  }

  const token = cookies().get(JWT_COOKIE_NAME)?.value;
  if (token) {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    if (decoded.userType === "TEMP" && pathname !== "/register") {
      return NextResponse.redirect("/register");
    }
  }

  return NextResponse.next();
}
