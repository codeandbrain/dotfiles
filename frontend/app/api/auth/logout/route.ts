import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('orbit_session');
  response.cookies.delete('orbit_oauth_state');
  return response;
}
