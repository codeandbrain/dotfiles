import { NextResponse } from "next/server";
import { exchangeGitHubCode } from "../../../../lib/server/github-api";
import {
  encryptSession,
  verifyOAuthState,
} from "../../../../lib/server/github-session";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("orbit_oauth_state")?.value;
  const origin = process.env.NEXT_PUBLIC_APP_URL || url.origin;
  const destination = new URL("/", origin);
  const fail = (reason: string) => {
    destination.searchParams.set("auth_error", reason);
    const response = NextResponse.redirect(destination);
    response.cookies.delete("orbit_oauth_state");
    return response;
  };

  if (
    !code ||
    !state ||
    !expectedState ||
    !verifyOAuthState(expectedState, state)
  ) {
    return fail("invalid_oauth_state");
  }

  try {
    const accessToken = await exchangeGitHubCode(code, origin);
    const session = await encryptSession({
      accessToken,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
    const response = NextResponse.redirect(destination);
    response.cookies.set("orbit_session", session, {
      httpOnly: true,
      secure: origin.startsWith("https://"),
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    response.cookies.delete("orbit_oauth_state");
    return response;
  } catch {
    return fail("github_connection_failed");
  }
}
