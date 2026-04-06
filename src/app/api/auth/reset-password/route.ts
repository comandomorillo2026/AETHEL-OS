import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
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

    // Find valid reset token
    const resetToken = await db.passwordResetToken.findFirst({
      where: {
        token,
        expiresAt: {
          gte: new Date().toISOString(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!resetToken || !resetToken.user) {
      return NextResponse.json(
        { error: 'Token inválido o expirado. Solicita un nuevo enlace de restablecimiento.' },
        { status: 400 }
      );
    }

    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update user password
    await db.systemUser.update({
      where: { id: resetToken.userId },
      data: {
        passwordHash,
      },
    });

    // Delete all reset tokens for this user
    await db.passwordResetToken.deleteMany({
      where: { userId: resetToken.userId },
    });

    // Log activity
    try {
      await db.activityLog.create({
        data: {
          userId: resetToken.user.id,
          userEmail: resetToken.user.email,
          userName: resetToken.user.name,
          action: 'update',
          entityType: 'user',
          entityId: resetToken.user.id,
          description: 'Contraseña actualizada via reset',
        },
      });
    } catch (logError) {
      console.log('[RESET_PASSWORD] Could not log activity:', logError);
    }

    console.log('[RESET_PASSWORD] Password reset successful for:', resetToken.user.email);

    return NextResponse.json({ 
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
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

// GET: Validate token without resetting
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token requerido' },
        { status: 400 }
      );
    }

    const resetToken = await db.passwordResetToken.findFirst({
      where: {
        token,
        expiresAt: {
          gte: new Date().toISOString(),
        },
      },
    });

    if (!resetToken) {
      return NextResponse.json(
        { valid: false, error: 'Token inválido o expirado' },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('[RESET_PASSWORD_VALIDATE_ERROR]', error);
    return NextResponse.json(
      { valid: false, error: 'Error validando token' },
      { status: 500 }
    );
  }
}
