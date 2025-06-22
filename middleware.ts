// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const middleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminPath = req.nextUrl.pathname.startsWith("/admin");
    const isLoginPath = req.nextUrl.pathname === "/admin/login";

    // Allow access to login page without authentication
    if (isLoginPath) {
      return NextResponse.next();
    }

    // For admin paths, check if user has admin role
    if (isAdminPath && (!token || token.role !== "ADMIN")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isLoginPath = req.nextUrl.pathname === "/admin/login";
        const isAdminPath = req.nextUrl.pathname.startsWith("/admin");

        // Always allow access to login page
        if (isLoginPath) {
          return true;
        }

        // For admin paths, require valid token
        if (isAdminPath) {
          return !!token;
        }

        // Allow all other paths
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
