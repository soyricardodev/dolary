import { NextResponse } from "next/server";

export function middleware() {
  const targetUrl = "https://www.bcv.org.ve";
  return NextResponse.redirect(targetUrl);
}

export const config = {
  matcher: "/((?!api)/.*)",
};

