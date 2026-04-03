import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { sendPasswordResetEmail } from '@/lib/email/resend';
import crypto from 'crypto';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Find user
    const user = await prisma.systemUser.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save token to user
    await prisma.systemUser.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires: resetTokenExpires.toISOString(),
      },
    });

    // Send reset email
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    await sendPasswordResetEmail({
      name: user.name,
      email: user.email,
      resetUrl: `${appUrl}/reset-password?token=${resetToken}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[FORGOT_PASSWORD_ERROR]', error);
    return NextResponse.json({ success: true });
  }
}
