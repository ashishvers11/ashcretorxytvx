import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv, isSupabaseConfigured } from "./config";

export const PROTECTED_ROUTES = [
  "/dashboard",
  "/channel-audit",
  "/trend-radar",
  "/trend-script",
  "/video-production",
  "/seo-studio",
  "/thumbnail-studio",
  "/profile",
];

const AUTH_ROUTES = [
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
];

/**
 * Handles server-side session refresh and route protection.
 * Follows Next.js 14 SSR authentication architecture.
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If Supabase environment is not configured, intercept protected routes
  if (!isSupabaseConfigured()) {
    if (isProtectedRoute) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("error", "unconfigured");
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  // Securely refresh and validate user token with Supabase Auth
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 1. Unauthenticated users cannot access protected routes
    if (!user && isProtectedRoute) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Authenticated users are redirected away from auth routes to dashboard
    if (user && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } catch {
    // If Supabase network request fails, redirect protected routes to login safely
    if (isProtectedRoute) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("error", "session_error");
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}
