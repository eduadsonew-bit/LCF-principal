import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const teams = await db.team.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Error al obtener equipos' }, { status: 500 });
  }
}
