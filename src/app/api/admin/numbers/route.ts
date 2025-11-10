import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { AdType, OperatorCode } from '@/generated/prisma';

// Helper functions
function getOperatorFromPrefix(prefix: string): OperatorCode {
  const operatorMap: { [key: string]: OperatorCode } = {
    '010': 'AZERCELL',
    '050': 'AZERCELL',
    '051': 'AZERCELL', 
    '055': 'BAKCELL',
    '099': 'BAKCELL',
    '060': 'NAXTEL',
    '070': 'NAR_MOBILE',
    '077': 'NAR_MOBILE'
  };
  
  return operatorMap[prefix] || 'AZERCELL';
}

function getAdTypeFromString(type: string): AdType {
  switch (type.toLowerCase()) {
    case 'premium': return 'PREMIUM';
    case 'gold': return 'GOLD';
    case 'standard': return 'STANDARD';
    default: return 'STANDARD';
  }
}

function calculateExpiryDate(type: AdType): Date {
  const now = new Date();
  const days = type === 'PREMIUM' ? 30 : type === 'GOLD' ? 20 : 7;
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
}

// POST - Add new phone number
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, price, contactPhone, type, description, isSeller } = body;

    console.log('POST Request received:', { phoneNumber, price, contactPhone, type, description, isSeller });

    // Comprehensive server-side validation
    const validationErrors: string[] = [];

    // Validate phone number
    if (!phoneNumber || phoneNumber.trim() === '') {
      validationErrors.push('Telefon nömrəsi boş ola bilməz');
    } else if (phoneNumber.length < 10) {
      validationErrors.push('Telefon nömrəsi çox qısadır');
    }

    // Validate price
    if (!price || price.toString().trim() === '') {
      validationErrors.push('Qiymət boş ola bilməz');
    } else {
      const priceNumber = parseInt(price.toString());
      if (isNaN(priceNumber) || priceNumber <= 0) {
        validationErrors.push('Qiymət müsbət rəqəm olmalıdır');
      }
    }

    // Validate contact phone
    if (!contactPhone || contactPhone.trim() === '') {
      validationErrors.push('Əlaqə nömrəsi boş ola bilməz');
    } else if (contactPhone.length < 7) {
      validationErrors.push('Əlaqə nömrəsi çox qısadır');
    }

    // Validate type
    if (!type || type.trim() === '') {
      validationErrors.push('Nömrə növü boş ola bilməz');
    } else if (!['standard', 'gold', 'premium'].includes(type)) {
      validationErrors.push('Keçərsiz nömrə növü');
    }

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    // Extract prefix and determine operator
    const prefix = phoneNumber.replace(/\D/g, '').substring(0, 3);
    const operator = getOperatorFromPrefix(prefix);
    const adType = getAdTypeFromString(type);
    const expiresAt = calculateExpiryDate(adType);

    // Create new phone number in MongoDB
    // IMPORTANT: Convert AZN to qepik (1 AZN = 100 qepik) for storage
    const newNumber = await prisma.phoneNumber.create({
      data: {
        phoneNumber: phoneNumber,
        price: parseInt(price) * 100, // Convert AZN to qepik
        contactPhone: contactPhone || '',
        description: description || '',
        type: adType,
        operator: operator,
        prefix: prefix,
        status: 'ACTIVE',
        isSeller: isSeller || false,
        expiresAt: expiresAt,
        tags: [],
        viewCount: 0,
        favoriteCount: 0
      }
    });

    console.log('Successfully created phone number:', newNumber);

    return NextResponse.json({
      success: true,
      message: 'Nömrə uğurla əlavə edildi',
      data: newNumber,
      storage: 'MongoDB',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Server xətası', details: error },
      { status: 500 }
    );
  }
}

// PUT - Update existing phone number
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, phoneNumber, price, contactPhone, type, description, isSeller } = body;

    // Comprehensive server-side validation for update
    const validationErrors: string[] = [];

    // Validate ID
    if (!id || id.trim() === '') {
      validationErrors.push('ID boş ola bilməz');
    }

    // Validate phone number
    if (!phoneNumber || phoneNumber.trim() === '') {
      validationErrors.push('Telefon nömrəsi boş ola bilməz');
    } else if (phoneNumber.length < 10) {
      validationErrors.push('Telefon nömrəsi çox qısadır');
    }

    // Validate price
    if (!price || price.toString().trim() === '') {
      validationErrors.push('Qiymət boş ola bilməz');
    } else {
      const priceNumber = parseInt(price.toString());
      if (isNaN(priceNumber) || priceNumber <= 0) {
        validationErrors.push('Qiymət müsbət rəqəm olmalıdır');
      }
    }

    // Validate contact phone
    if (!contactPhone || contactPhone.trim() === '') {
      validationErrors.push('Əlaqə nömrəsi boş ola bilməz');
    } else if (contactPhone.length < 7) {
      validationErrors.push('Əlaqə nömrəsi çox qısadır');
    }

    // Validate type
    if (!type || type.trim() === '') {
      validationErrors.push('Nömrə növü boş ola bilməz');
    } else if (!['standard', 'gold', 'premium'].includes(type)) {
      validationErrors.push('Keçərsiz nömrə növü');
    }

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    // Extract prefix and determine operator
    const prefix = phoneNumber.replace(/\D/g, '').substring(0, 3);
    const operator = getOperatorFromPrefix(prefix);
    const adType = getAdTypeFromString(type);

    // Update phone number in MongoDB
    // IMPORTANT: Convert AZN to qepik (1 AZN = 100 qepik) for storage
    const updatedNumber = await prisma.phoneNumber.update({
      where: { id: id },
      data: {
        phoneNumber: phoneNumber,
        price: parseInt(price) * 100, // Convert AZN to qepik
        contactPhone: contactPhone || '',
        description: description || '',
        type: adType,
        operator: operator,
        prefix: prefix,
        isSeller: isSeller || false,
        updatedAt: new Date()
      }
    });

    console.log('Successfully updated phone number:', updatedNumber);

    return NextResponse.json({
      success: true,
      message: 'Nömrə uğurla yeniləndi',
      data: updatedNumber,
      storage: 'MongoDB'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Server xətası', details: error },
      { status: 500 }
    );
  }
}

// DELETE - Remove phone number
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID mütləqdir' },
        { status: 400 }
      );
    }

    // Delete phone number from MongoDB
    await prisma.phoneNumber.delete({
      where: { id: id }
    });

    console.log('Successfully deleted phone number:', id);

    return NextResponse.json({
      success: true,
      message: 'Nömrə uğurla silindi',
      storage: 'MongoDB'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Server xətası', details: error },
      { status: 500 }
    );
  }
}

// GET - Fetch phone numbers
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/admin/numbers - Starting request');
    
    // Check database connection
    if (!prisma) {
      console.error('❌ Prisma client not initialized');
      return NextResponse.json(
        { error: 'Database connection failed', details: 'Prisma client not initialized' },
        { status: 500 }
      );
    }

    // Check DATABASE_URL environment variable
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable not set');
      return NextResponse.json(
        { 
          error: 'Database configuration missing', 
          details: 'DATABASE_URL environment variable is not set',
          environment: {
            NODE_ENV: process.env.NODE_ENV,
            VERCEL: process.env.VERCEL
          }
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const operator = searchParams.get('operator');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('📋 Query parameters:', { type, operator, status, limit, offset });

    // Build where clause
    const where: Record<string, unknown> = {};
    
    if (type) {
      where.type = getAdTypeFromString(type);
    }
    
    if (operator) {
      where.operator = operator.toUpperCase();
    }
    
    if (status) {
      where.status = status.toUpperCase();
    }

    console.log('🔍 Where clause:', where);

    // Test database connection first
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

    // Fetch phone numbers from MongoDB
    const phoneNumbers = await prisma.phoneNumber.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        location: true
      }
    });

    console.log(`📱 Found ${phoneNumbers.length} phone numbers`);

    const total = await prisma.phoneNumber.count({ where });
    console.log(`📊 Total count: ${total}`);

    // Convert Date objects to ISO strings for JSON serialization
    // IMPORTANT: Convert qepik to AZN (100 qepik = 1 AZN) for display
    const serializedNumbers = phoneNumbers.map(phone => ({
      ...phone,
      price: Math.round(phone.price / 100), // Convert qepik to AZN
      createdAt: phone.createdAt.toISOString(),
      updatedAt: phone.updatedAt.toISOString(),
      expiresAt: phone.expiresAt.toISOString()
    }));

    console.log('✅ Successfully processed phone numbers');

    return NextResponse.json({
      success: true,
      data: serializedNumbers,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      storage: 'MongoDB'
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        error: 'Server xətası', 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}