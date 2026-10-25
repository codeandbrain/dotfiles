import { NextResponse } from 'next/server';
import { getGitHubAuthorizationUrl } from '../../../../lib/server/github-api';
import { generateOAuthState } from '../../../../lib/server/github-session';

export async function GET(request: Request) {
  const state = generateOAuthState();
  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const response = NextResponse.redirect(getGitHubAuthorizationUrl(state, origin));
  response.cookies.set('orbit_oauth_state', state, {
    httpOnly: true,
    secure: origin.startsWith('https://'),
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  });
  return response;
}
