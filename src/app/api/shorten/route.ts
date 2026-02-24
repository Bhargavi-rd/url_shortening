import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  try {
    const { url, password } = await request.json();
    const session = await getServerSession();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (e) {
      console.log('Invalid URL:', url);
      console.log('Error:', e);
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Check if URL already exists
    let existing = await prisma.url.findFirst({
      where: { original: url },
    });

    if (existing) {
      const shortUrl = `${new URL(request.url).origin}/${existing.shortCode}`;
      return NextResponse.json({ shortUrl });
    }

    // Create new short code
    const shortCode = nanoid(6);
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    
    // Find user by email if session exists
    let user = null;
    if (session?.user?.email) {
      user = await prisma.user.findUnique({ where: { email: session.user.email } });
    }

    const newUrl = await prisma.url.create({
      data: {
        original: url,
        shortCode,
        password: hashedPassword,
        userId: user?.id || null,
      },
    });

    const shortUrl = `${new URL(request.url).origin}/${newUrl.shortCode}`;
    return NextResponse.json({ shortUrl });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
