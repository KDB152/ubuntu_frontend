// src/app/api/auth/verify-email/route.ts (VERSION CORRIGÉE)
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token manquant' },
        { status: 400 }
      );
    }

    console.log('🔍 Vérification token:', token.substring(0, 8) + '...');

    // ✅ CORRECTION : Utiliser l'endpoint POST au lieu de GET pour éviter la redirection
    const backendResponse = await fetch(`http://localhost:3001/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    console.log('📡 Statut backend:', backendResponse.status);

    if (!backendResponse.ok) {
      let errorMessage = 'Erreur de vérification';
      try {
        const errorData = await backendResponse.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        const errorText = await backendResponse.text();
        errorMessage = errorText || errorMessage;
      }
      
      console.error('❌ Erreur backend:', errorMessage);
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: backendResponse.status }
      );
    }

    // ✅ Gestion correcte de la réponse JSON
    try {
      const data = await backendResponse.json();
      console.log('📄 Réponse backend:', data);
      return NextResponse.json(data);
    } catch (jsonError) {
      // Si ce n'est pas du JSON, c'est peut-être une redirection réussie
      console.log('✅ Vérification réussie (pas de JSON retourné)');
      return NextResponse.json({ 
        success: true, 
        message: 'Email vérifié avec succès' 
      });
    }

  } catch (error: any) {
    console.error('💥 Erreur lors de la vérification:', error);
    return NextResponse.json(
      { success: false, message: `Erreur serveur: ${error.message}` },
      { status: 500 }
    );
  }
}