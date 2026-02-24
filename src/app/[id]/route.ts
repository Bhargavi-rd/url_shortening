import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const urlEntry = await prisma.url.findUnique({
    where: { shortCode: id },
  });

  if (!urlEntry) {
    return NextResponse.json({ error: 'URL not found' }, { status: 404 });
  }

  if (urlEntry.password) {
    const passwordUrl = new URL(`/${id}/password`, request.url);
    return NextResponse.redirect(passwordUrl);
  }

  // Increment clicks (async)
  prisma.url.update({
    where: { id: urlEntry.id },
    data: { clicks: { increment: 1 } },
  }).catch(err => console.error('Error updating clicks:', err));

  return NextResponse.redirect(urlEntry.original);
}
