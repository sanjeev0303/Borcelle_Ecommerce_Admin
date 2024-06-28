import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const response = NextResponse.json({ message: 'Cookie set' });
  response.headers.set('Set-Cookie', 'myCookie=myValue; Path=/; HttpOnly=true; Secure=true; SameSite=lax');
  return response;
}