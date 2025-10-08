'use server';

import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();
import bcrypt from 'bcryptjs';

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Server Action for admin authentication
 * Checks admin password against database
 */
export async function authenticateAdmin(password: string): Promise<AuthResult> {
  try {
    // Validate password
    if (!password || password.trim() === '') {
      return {
        success: false,
        error: 'Şifrə boş ola bilməz'
      };
    }
    
    // Find admin user in database
    const adminUser = await prisma.user.findFirst({
      where: {
        isAdmin: true
      }
    });
    
    if (!adminUser) {
      return {
        success: false,
        error: 'Admin istifadəçisi tapılmadı'
      };
    }
    
    // Check password (assuming it's hashed with bcrypt)
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    
    if (isPasswordValid) {
      return {
        success: true,
        user: {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email
        }
      };
    } else {
      return {
        success: false,
        error: 'Yanlış şifrə! Zəhmət olmasa yenidən cəhd edin.'
      };
    }
  } catch (error) {
    console.error('Admin authentication error:', error);
    return {
      success: false,
      error: 'Server xətası baş verdi'
    };
  }
}

/**
 * Create admin user if not exists
 */
export async function createAdminUser(): Promise<void> {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD || 'elvin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const existingAdmin = await prisma.user.findFirst({
      where: {
        isAdmin: true
      }
    });
    
    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          name: 'Admin',
          email: 'admin@nomremzade.az',
          phone: '050-000-00-00',
          password: hashedPassword,
          isAdmin: true,
          isPremium: true
        }
      });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

/**
 * Validate admin session (for future use)
 */
export async function validateAdminSession(): Promise<boolean> {
  // This can be extended to check JWT tokens or session data
  // For now, we'll keep it simple
  return true;
}
