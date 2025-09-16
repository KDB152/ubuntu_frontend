import { NextRequest, NextResponse } from 'next/server';

// URL de l'API backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classFilter = searchParams.get('class');
    const statusFilter = searchParams.get('status');
    const searchQuery = searchParams.get('search');

    // Construire l'URL de l'API backend
    const backendUrl = new URL(`${API_BASE_URL}/admin/payments`);
    if (classFilter && classFilter !== 'Total') {
      backendUrl.searchParams.append('classLevel', classFilter);
    }
    if (statusFilter && statusFilter !== 'Tous') {
      backendUrl.searchParams.append('status', statusFilter);
    }
    if (searchQuery) {
      backendUrl.searchParams.append('search', searchQuery);
    }

    console.log('🔄 Appel API backend:', backendUrl.toString());

    // Appeler l'API backend
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur API backend: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Données reçues du backend:', data);

    return NextResponse.json(data.payments || data);
    
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des paiements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Implémenter la logique de création de paiement
    // Cette méthode doit créer un nouvel enregistrement dans la table paiement
    
    return NextResponse.json(
      { message: 'Paiement créé avec succès', id: Date.now() },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Implémenter la logique de mise à jour de paiement
    // Cette méthode doit mettre à jour un enregistrement existant dans la table paiement
    
    return NextResponse.json(
      { message: 'Paiement mis à jour avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paiement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du paiement' },
      { status: 500 }
    );
  }
}

