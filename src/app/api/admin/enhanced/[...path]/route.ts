import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { AdType, OperatorCode } from '@/generated/prisma';

// Helper functions
function getOperatorFromString(operator: string): OperatorCode {
  const operatorMap: { [key: string]: OperatorCode } = {
    'azercell': 'AZERCELL',
    'bakcell': 'BAKCELL',
    'naxtel': 'NAXTEL',
    'nar-mobile': 'NAR_MOBILE',
    'narmobile': 'NAR_MOBILE'
  };
  
  return operatorMap[operator.toLowerCase()] || 'AZERCELL';
}

function getAdTypeFromString(type: string): AdType {
  switch (type.toLowerCase()) {
    case 'premium': return 'PREMIUM';
    case 'gold': return 'GOLD';
    case 'standard': return 'STANDARD';
    default: return 'STANDARD';
  }
}

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

function calculateExpiryDate(type: AdType): Date {
  const now = new Date();
  const days = type === 'GOLD' ? 30 : type === 'PREMIUM' ? 15 : 7;
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
}

/**
 * Enhanced Admin API - MongoDB Version
 * Manages phone numbers via MongoDB: /api/admin/enhanced/[operator]/[type]
 */

// GET: Retrieve operator data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    console.log('🔍 GET /api/admin/enhanced/[...path] - Starting request');
    
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

    const { path: pathArray } = await params;
    const [operator, type] = pathArray;
    
    if (!operator || !type) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid path',
          details: 'Expected format: /api/admin/enhanced/{operator}/{type}'
        },
        { status: 400 }
      );
    }

    console.log(`📋 Enhanced Admin API request: ${operator}/${type}`);

    // Convert string parameters to enums
    const adType = getAdTypeFromString(type);

    console.log('🔍 Query parameters:', { operator, type, adType });

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

    // Convert string parameters to enums
    const operatorCode = getOperatorFromString(operator);
    
    // Fetch phone numbers from MongoDB
    const phoneNumbers = await prisma.phoneNumber.findMany({
      where: {
        operator: operatorCode,
        type: adType
      },
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

    // Convert Date objects to ISO strings for JSON serialization
    const serializedNumbers = phoneNumbers.map(phone => ({
      ...phone,
      createdAt: phone.createdAt.toISOString(),
      updatedAt: phone.updatedAt.toISOString(),
      expiresAt: phone.expiresAt.toISOString()
    }));

    // Create enhanced format response
    const enhancedData = {
      operator: operatorCode,
      type: adType,
      version: '2.0.0',
      ads: serializedNumbers,
      statistics: {
        totalCount: phoneNumbers.length,
        activeCount: phoneNumbers.filter(phone => phone.status === 'ACTIVE').length,
        soldCount: phoneNumbers.filter(phone => phone.status === 'SOLD').length,
        averagePrice: phoneNumbers.length > 0 
          ? Math.round(phoneNumbers.reduce((sum, phone) => sum + phone.price, 0) / phoneNumbers.length)
          : 0,
        priceRange: {
          min: phoneNumbers.length > 0 ? Math.min(...phoneNumbers.map(phone => phone.price)) : 0,
          max: phoneNumbers.length > 0 ? Math.max(...phoneNumbers.map(phone => phone.price)) : 0
        }
      },
      lastUpdated: new Date().toISOString(),
      lastSync: new Date().toISOString()
    };

    console.log('✅ Successfully processed enhanced admin data');

    return NextResponse.json({
      success: true,
      data: enhancedData,
      metadata: {
        operator: operatorCode,
        type: adType,
        count: phoneNumbers.length,
        storage: 'MongoDB'
      }
    });
    
  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Server xətası', 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// POST: Add new phone number
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    console.log('🔍 POST /api/admin/enhanced/[...path] - Starting request');
    
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

    const { path: pathArray } = await params;
    const [operator, type] = pathArray;
    
    if (!operator || !type) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid path',
          details: 'Expected format: /api/admin/enhanced/{operator}/{type}'
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { phoneNumber, price, contactPhone, description, isVip, isSeller } = body;

    console.log('POST Request received:', { phoneNumber, price, contactPhone, type, description, isVip, isSeller });

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

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: validationErrors.join(', ')
        },
        { status: 400 }
      );
    }

    // Convert string parameters to enums
    const adType = getAdTypeFromString(type);

    // Extract prefix and determine operator
    const prefix = phoneNumber.replace(/\D/g, '').substring(0, 3);
    const detectedOperator = getOperatorFromPrefix(prefix);
    const expiresAt = calculateExpiryDate(adType);

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

    // Create new phone number in MongoDB
    const newNumber = await prisma.phoneNumber.create({
      data: {
        phoneNumber: phoneNumber,
        price: parseInt(price),
        contactPhone: contactPhone || '',
        description: description || '',
        type: adType,
        operator: detectedOperator,
        prefix: prefix,
        status: 'ACTIVE',
        isVip: isVip || false,
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
      data: {
        ...newNumber,
        createdAt: newNumber.createdAt.toISOString(),
        updatedAt: newNumber.updatedAt.toISOString(),
        expiresAt: newNumber.expiresAt.toISOString()
      },
      metadata: {
        storage: 'MongoDB',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Server xətası', 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// PUT: Update existing phone number
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    console.log('🔍 PUT /api/admin/enhanced/[...path] - Starting request');
    
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

    const { path: pathArray } = await params;
    const [operator, type] = pathArray;
    
    if (!operator || !type) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid path',
          details: 'Expected format: /api/admin/enhanced/{operator}/{type}'
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { id, phoneNumber, price, contactPhone, description, isVip, isSeller } = body;

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

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: validationErrors.join(', ')
        },
        { status: 400 }
      );
    }

    // Convert string parameters to enums
    const adType = getAdTypeFromString(type);

    // Extract prefix and determine operator
    const prefix = phoneNumber.replace(/\D/g, '').substring(0, 3);
    const detectedOperator = getOperatorFromPrefix(prefix);

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

    // Update phone number in MongoDB
    const updatedNumber = await prisma.phoneNumber.update({
      where: { id: id },
      data: {
        phoneNumber: phoneNumber,
        price: parseInt(price),
        contactPhone: contactPhone || '',
        description: description || '',
        type: adType,
        operator: detectedOperator,
        prefix: prefix,
        isVip: isVip || false,
        isSeller: isSeller || false,
        updatedAt: new Date()
      }
    });

    console.log('Successfully updated phone number:', updatedNumber);

    return NextResponse.json({
      success: true,
      message: 'Nömrə uğurla yeniləndi',
      data: {
        ...updatedNumber,
        createdAt: updatedNumber.createdAt.toISOString(),
        updatedAt: updatedNumber.updatedAt.toISOString(),
        expiresAt: updatedNumber.expiresAt.toISOString()
      },
      metadata: {
        storage: 'MongoDB',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Server xətası', 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE: Remove phone number
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    console.log('🔍 DELETE /api/admin/enhanced/[...path] - Starting request');
    
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

    const { path: pathArray } = await params;
    const [operator, type] = pathArray;
    
    if (!operator || !type) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid path',
          details: 'Expected format: /api/admin/enhanced/{operator}/{type}'
        },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          error: 'ID is required',
          details: 'Please provide an id parameter'
        },
        { status: 400 }
      );
    }

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

    // Delete phone number from MongoDB
    const deletedNumber = await prisma.phoneNumber.delete({
      where: { id: id }
    });

    console.log('Successfully deleted phone number:', deletedNumber);

    return NextResponse.json({
      success: true,
      message: 'Nömrə uğurla silindi',
      data: {
        ...deletedNumber,
        createdAt: deletedNumber.createdAt.toISOString(),
        updatedAt: deletedNumber.updatedAt.toISOString(),
        expiresAt: deletedNumber.expiresAt.toISOString()
      },
      metadata: {
        storage: 'MongoDB',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Server xətası', 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}