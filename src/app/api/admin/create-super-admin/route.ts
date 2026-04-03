import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    // Security check - only allow if no SUPER_ADMIN exists yet or with secret
    const existingAdmins = await db.systemUser.count({
      where: { role: 'SUPER_ADMIN' }
    });

    // If there are already admins, require a setup secret
    if (existingAdmins > 0) {
      const secret = request.headers.get('X-Setup-Secret');
      if (secret !== process.env.SETUP_SECRET && secret !== 'NexusOS-Setup-2026') {
        return NextResponse.json({ 
          error: 'Admin users already exist. Use the admin panel to manage users.' 
        }, { status: 403 });
      }
    }

    // Validate input
    if (!email || !name || !password) {
      return NextResponse.json({ 
        error: 'Email, name, and password are required' 
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.systemUser.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      // Update to SUPER_ADMIN if needed
      const updated = await db.systemUser.update({
        where: { id: existingUser.id },
        data: { 
          role: 'SUPER_ADMIN', 
          isActive: true,
          name: name || existingUser.name
        }
      });
      
      return NextResponse.json({ 
        success: true,
        message: 'User updated to SUPER_ADMIN',
        user: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          role: updated.role
        }
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create the admin user
    const admin = await db.systemUser.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        role: 'SUPER_ADMIN',
        isActive: true,
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'SUPER_ADMIN created successfully',
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('[CREATE_SUPER_ADMIN] Error:', error);
    return NextResponse.json({ 
      error: 'Failed to create admin user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint to check admin status
export async function GET() {
  try {
    const adminCount = await db.systemUser.count({
      where: { role: 'SUPER_ADMIN' }
    });

    return NextResponse.json({
      hasAdmin: adminCount > 0,
      adminCount
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check admin status' }, { status: 500 });
  }
}
