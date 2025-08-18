// app/api/auth/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const action = searchParams.get('action') || 'verify-token';

  if (!token) {
    console.error('Aucun token fourni dans la requête');
    return NextResponse.redirect(new URL('/login?error=no_token', process.env.NEXT_PUBLIC_FRONTEND_URL));
  }

  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/${action}?token=${token}`;
    console.log(`Proxying request to backend: ${backendUrl}`);
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la vérification');
    }

    console.log('Vérification réussie');
    return NextResponse.redirect(new URL('/login?verified=true', process.env.NEXT_PUBLIC_FRONTEND_URL));
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error.message);
    return NextResponse.redirect(
      new URL(`/login?error=verification_failed&message=${encodeURIComponent(error.message)}`, process.env.NEXT_PUBLIC_FRONTEND_URL)
    );
  }
}