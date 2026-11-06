# ASH CREATOR STUDIO: SECURITY AUDIT (TASK 001)

**Audit Date:** 2026-11-07  
**Scope:** Authentication, Authorization, Secret Storage, Token Sanitization, RLS, Input Handling  

---

## 1. Security Posture Summary

| Security Domain | Status | Code Evidence / Finding |
|---|---|---|
| **Secret Leakage in Git** | **SECURE** | `.gitignore` includes `.env`, `.env.local`, `.env.*.local`, `node_modules`, `.next`. Git history check confirms no production secrets are tracked. |
| **Token Exposure to Frontend** | **SECURE** | `src/app/api/auth/youtube/status/route.ts` strictly sanitizes the response, returning only boolean flags (`isConnected`, `isAuthorized`, `scopes`), never the raw `access_token` or `refresh_token`. |
| **Database Row Level Security (RLS)** | **SECURE (SCHEMA)** | All 15 Supabase tables have RLS enabled with explicit `USING (auth.uid() = user_id)` and `WITH CHECK (auth.uid() = user_id)` policies. |
| **Route Protection & Middleware** | **SECURE** | `src/middleware.ts` intercepts `/dashboard/*`, `/profile/*`, `/settings/*`, `/modules/*` and redirects unauthenticated requests to `/login?redirectTo=...`. |
| **SQL Injection Defense** | **SECURE** | The application uses the Supabase PostgREST client exclusively (`.from(...).select(...)`), which uses parameterized SQL queries. No raw string interpolation exists in queries. |
| **User Identity Multi-Tenancy** | **VULNERABLE** | API route handlers (`/api/youtube/analytics`, `/api/youtube/sync`, `/api/auth/youtube/status`, `/api/auth/youtube/disconnect`) hardcode `userId = "demo-creator-uuid"`. |
| **Ephemeral Token Storage in Serverless** | **MEDIUM RISK** | When Supabase is offline, tokens are kept in an in-memory `Map` that is wiped between lambda invocations. |

---

## 2. In-Depth Vulnerability Analysis

### Vulnerability 1: Hardcoded `demo-creator-uuid` Breaks Multi-Tenant Authorization
- **Location:** `src/app/api/youtube/analytics/route.ts:15`, `src/app/api/youtube/sync/route.ts:11`, `src/app/api/auth/youtube/status/route.ts:12`.
- **Severity:** **HIGH** (in multi-user mode).
- **Vulnerability Description:** If User A and User B both create accounts on the platform, both will call these endpoints with `userId = "demo-creator-uuid"`. User B's sync request will read and update User A's channel connection and analytics.
- **Remediation:** Always extract the authenticated user ID from `createServerClient().auth.getUser()`:
  ```typescript
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = user.id;
  ```

---

### Vulnerability 2: Missing CSRF State Verification in OAuth Callback
- **Location:** `src/app/api/auth/youtube/callback/route.ts` (Lines 16, 21–25):
  ```typescript
  const state = searchParams.get("state");
  if (state) {
    const decoded = JSON.parse(Buffer.from(state, "base64").toString());
    if (decoded.redirectPath) redirectPath = decoded.redirectPath;
  }
  ```
- **Severity:** **MEDIUM**.
- **Vulnerability Description:** The OAuth `state` parameter currently encodes only `redirectPath` and `timestamp`. It does not include an unpredictable cryptographically random nonce stored in an HttpOnly cookie to verify that the callback originated from the same user browser session (CSRF protection on OAuth authorization).
- **Remediation:** Generate an `oauth_state` cookie containing a cryptographic UUID before redirecting to Google, and verify `searchParams.get("state") === cookie.get("oauth_state")` upon callback.

---

### Vulnerability 3: Open Redirect Risk in `redirectPath`
- **Location:** `src/app/api/auth/youtube/callback/route.ts` (Lines 19–25):
  ```typescript
  let redirectPath = "/modules/channel-analytics";
  if (state) {
    const decoded = JSON.parse(Buffer.from(state, "base64").toString());
    if (decoded.redirectPath) redirectPath = decoded.redirectPath;
  }
  ...
  const redirectUrl = new URL(redirectPath, request.url);
  ```
- **Severity:** **LOW**.
- **Vulnerability Description:** If an attacker crafts a manipulated `state` parameter containing `redirectPath = "https://malicious-site.com"`, `new URL(redirectPath, request.url)` could resolve to an external domain.
- **Remediation:** Validate that `redirectPath` starts strictly with a single forward slash `/` and does not contain `//` or `http`:
  ```typescript
  if (!redirectPath.startsWith("/") || redirectPath.startsWith("//")) {
    redirectPath = "/modules/channel-analytics";
  }
  ```
