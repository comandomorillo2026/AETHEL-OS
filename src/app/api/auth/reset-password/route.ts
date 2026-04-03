import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = resetPasswordSchema.parse(body);

    // Find user with valid reset token
    const user = await prisma.systemUser.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gte: new Date().toISOString(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      );
    }

    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update user password and clear reset token
    await prisma.systemUser.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        action: 'update',
        entityType: 'user',
        entityId: user.id,
        description: 'Contraseña actualizada via reset',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[RESET_PASSWORD_ERROR]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al restablecer contraseña' },
      { status: 500 }
    );
  }
}
