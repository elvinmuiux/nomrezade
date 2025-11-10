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

/**
 * Enhanced Data API - MongoDB Version
 * Serves data from MongoDB: /api/enhanced/[operator]/[type]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    console.log('🔍 GET /api/enhanced/[...path] - Starting request');
    
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
          details: 'Expected format: /api/enhanced/{operator}/{type}'
        },
        { status: 400 }
      );
    }

    console.log(`📋 Enhanced API request: ${operator}/${type}`);

    // Convert string parameters to enums
    const operatorCode = getOperatorFromString(operator);
    const adType = getAdTypeFromString(type);

    console.log('🔍 Query parameters:', { operatorCode, adType });

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
      where: {
        operator: operatorCode,
        type: adType,
        status: 'ACTIVE'
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
    // IMPORTANT: Convert qepik to AZN (100 qepik = 1 AZN) for display
    const serializedNumbers = phoneNumbers.map(phone => ({
      ...phone,
      price: Math.round(phone.price / 100), // Convert qepik to AZN
      createdAt: phone.createdAt.toISOString(),
      updatedAt: phone.updatedAt.toISOString(),
      expiresAt: phone.expiresAt.toISOString()
    }));

    // Create enhanced format response
    // IMPORTANT: Calculate statistics with converted AZN prices
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
          ? Math.round(phoneNumbers.reduce((sum, phone) => sum + phone.price, 0) / phoneNumbers.length / 100) // Convert to AZN
          : 0,
        priceRange: {
          min: phoneNumbers.length > 0 ? Math.round(Math.min(...phoneNumbers.map(phone => phone.price)) / 100) : 0,
          max: phoneNumbers.length > 0 ? Math.round(Math.max(...phoneNumbers.map(phone => phone.price)) / 100) : 0
        }
      },
      lastUpdated: new Date().toISOString(),
      lastSync: new Date().toISOString()
    };

    console.log('✅ Successfully processed enhanced data');

    const response = NextResponse.json({
      success: true,
      data: enhancedData,
      metadata: {
        operator: operatorCode,
        type: adType,
        count: phoneNumbers.length,
        storage: 'MongoDB'
      }
    });
    
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
    
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

