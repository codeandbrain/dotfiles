import { NextResponse } from 'next/server';
import { loadGitHubWorkspace } from '../../../../lib/server/github-api';
import { decryptSession } from '../../../../lib/server/github-session';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get('orbit_session')?.value;
  if (!sessionValue) return NextResponse.json({ authenticated: false }, { status: 401 });

  try {
    const session = await decryptSession(sessionValue);
    return NextResponse.json({ authenticated: true, ...(await loadGitHubWorkspace(session.accessToken)) });
  } catch {
    const response = NextResponse.json({ authenticated: false, message: 'GitHub session expired. Please sign in again.' }, { status: 401 });
    response.cookies.delete('orbit_session');
    return response;
  }
}
