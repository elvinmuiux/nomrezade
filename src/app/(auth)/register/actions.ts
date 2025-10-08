"use server";

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { RegisterState } from '@/shared/lib/definitions';
import { prisma } from '@/shared/lib/prisma';

const registerSchema = z.object({
  name: z.string().min(2, 'Ad ən azı 2 hərfdən ibarət olmalıdır.'),
  email: z.string().email('Düzgün e-poçt ünvanı daxil edin.'),
  phone: z.string().min(9, 'Telefon nömrəsi düzgün deyil.'),
  password: z.string().min(6, 'Şifrə ən azı 6 simvoldan ibarət olmalıdır.'),
});

export async function registerUser(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const validatedFields = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation error',
      issues: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, password } = validatedFields.data;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { message: 'User exists', error: 'Bu e-poçt artıq istifadə olunur.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in MongoDB
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        isPremium: true, // All users are premium by default now
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isPremium: true,
        createdAt: true
      }
    });

    return { message: 'Uğurlu qeydiyyat!', user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      isPremium: newUser.isPremium,
      createdAt: newUser.createdAt.toISOString()
    } };
  } catch (error) {
    console.error('An unexpected error occurred during registration:', error);
    return { message: 'Server xətası: Qeydiyyat uğursuz oldu.', error: 'Qeydiyyat zamanı xəta baş verdi.' };
  }
}
