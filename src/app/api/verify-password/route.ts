import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { shortCode, password } = await request.json();

    const urlEntry = await prisma.url.findUnique({
      where: { shortCode },
    });

    if (!urlEntry || !urlEntry.password) {
      return NextResponse.json({ error: 'Link not found or not protected' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, urlEntry.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // Increment clicks
    await prisma.url.update({
      where: { id: urlEntry.id },
      data: { clicks: { increment: 1 } },
    });

    return NextResponse.json({ originalUrl: urlEntry.original });
  } catch (error) {
    console.error('Verify Password Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
