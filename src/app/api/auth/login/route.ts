import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/auth/login - Starting request');

    const body = await request.json();
    const { email, password } = body;

    console.log('📧 Login attempt:', { email, password: password ? '***' : 'empty' });

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email və şifrə tələb olunur' },
        { status: 400 }
      );
    }

    // Check database connection
    if (!prisma) {
      console.error('❌ Prisma client not initialized');
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable not set');
      return NextResponse.json(
        {
          success: false,
          error: 'Database configuration missing'
        },
        { status: 500 }
      );
    }

    try {
      await prisma.$connect();
      console.log('✅ Database connected successfully');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Find user in database
    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    });

    console.log('👤 User found:', user ? {
      id: user.id,
      email: user.email,
      name: user.name,
      isPremium: user.isPremium,
      hasPassword: !!user.password
    } : 'Not found');

    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { success: false, error: 'İstifadəçi tapılmadı' },
        { status: 401 }
      );
    }

    // Check password
    console.log('🔐 Checking password for:', email);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔐 Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return NextResponse.json(
        { success: false, error: 'Email və ya şifrə yanlışdır' },
        { status: 401 }
      );
    }

    console.log('✅ User login successful');

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isPremium: user.isPremium,
        loginTime: new Date().toISOString()
      },
      message: 'Giriş uğurlu'
    });

  } catch (error) {
    console.error('❌ Login API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Server xətası',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
