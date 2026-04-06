import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { checkRateLimit } from '@/lib/rate-limit';
import { authLogger, securityLogger } from '@/lib/logger';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export async function POST(request: NextRequest) {
  // Apply rate limiting for auth endpoints
  const rateLimitResult = checkRateLimit(request, 'auth');
  if (!rateLimitResult.success) {
    securityLogger.warn('Rate limit exceeded on reset-password endpoint', {
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    });

    return NextResponse.json(
      {
        error: rateLimitResult.message,
        retryAfter: Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000),
      },
      { status: 429 }
    );
  }

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
      securityLogger.warn('Invalid or expired reset token used', { tokenPrefix: token.substring(0, 8) });
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
      authLogger.error('Could not log password reset activity', logError);
    }

    authLogger.info('Password reset successful', {
      userId: resetToken.user.id,
      email: resetToken.user.email
    });

    securityLogger.info('Password changed via reset token', 'medium', {
      userId: resetToken.user.id,
    });

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    authLogger.error('Reset password error', error);

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
    authLogger.error('Token validation error', error);
    return NextResponse.json(
      { valid: false, error: 'Error validando token' },
      { status: 500 }
    );
  }
}
