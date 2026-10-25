import { NextResponse } from 'next/server';
import { archiveGitHubRepository } from '../../../../lib/server/github-api';
import { decryptSession } from '../../../../lib/server/github-session';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get('orbit_session')?.value;
  if (!sessionValue) return NextResponse.json({ message: 'Sign in with GitHub before archiving repositories.' }, { status: 401 });

  try {
    const session = await decryptSession(sessionValue);
    const body = (await request.json()) as { owner?: unknown; repo?: unknown };
    const owner = typeof body.owner === 'string' ? body.owner.trim() : '';
    const repo = typeof body.repo === 'string' ? body.repo.trim() : '';
    if (!owner || !repo || owner.includes('/') || repo.includes('/')) {
      return NextResponse.json({ message: 'A valid repository owner and name are required.' }, { status: 400 });
    }
    return NextResponse.json({ ok: true, repository: await archiveGitHubRepository(session.accessToken, owner, repo) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not archive the repository';
    return NextResponse.json({ message }, { status: 400 });
  }
}
