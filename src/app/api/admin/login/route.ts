import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/admin/login - Starting request');

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
        { error: 'Database connection failed', details: 'Prisma client not initialized' },
        { status: 500 }
      );
    }

    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable not set');
      return NextResponse.json(
        {
          error: 'Database configuration missing',
          details: 'DATABASE_URL environment variable is not set'
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
        { error: 'Database connection failed', details: String(dbError) },
        { status: 500 }
      );
    }

    // Find admin user in database
    const adminUser = await prisma.user.findFirst({
      where: {
        email: email,
        isAdmin: true
      }
    });

    console.log('👤 Admin user found:', adminUser ? {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      isAdmin: adminUser.isAdmin,
      hasPassword: !!adminUser.password
    } : 'Not found');

    if (!adminUser) {
      console.log('❌ Admin user not found');
      return NextResponse.json(
        { success: false, error: 'Admin istifadəçisi tapılmadı' },
        { status: 401 }
      );
    }

    // Check password
    console.log('🔐 Checking password for:', email);
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    console.log('🔐 Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return NextResponse.json(
        { success: false, error: 'Yanlış şifrə! Zəhmət olmasa yenidən cəhd edin.' },
        { status: 401 }
      );
    }

    console.log('✅ Admin login successful');

    return NextResponse.json({
      success: true,
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email
      },
      message: 'Admin girişi uğurlu'
    });

  } catch (error) {
    console.error('❌ Admin login API error:', error);
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