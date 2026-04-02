import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyDemoCredentials, getRedirectPath } from './demo-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('[AUTH] Authorize called for:', credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log('[AUTH] Missing credentials');
          return null;
        }

        // Try demo authentication first (works without database)
        const demoUser = verifyDemoCredentials(credentials.email, credentials.password);
        if (demoUser) {
          console.log('[AUTH] Demo authentication successful for:', demoUser.email);
          return {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
            role: demoUser.role,
            tenantId: demoUser.tenantId || null,
            tenantSlug: demoUser.tenantSlug || null,
            tenantName: demoUser.tenantName || null,
            industrySlug: demoUser.industrySlug || null,
          };
        }

        // If demo auth fails, try database auth
        try {
          const { prisma } = await import('../db');
          const bcrypt = await import('bcryptjs');

          const user = await prisma.systemUser.findUnique({
            where: { email: credentials.email },
          });

          console.log('[AUTH] Database user found:', user ? user.email : 'NOT FOUND');

          if (!user || !user.isActive) {
            console.log('[AUTH] User not found or inactive');
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          console.log('[AUTH] Password match:', passwordMatch);

          if (!passwordMatch) {
            return null;
          }

          // Update last login
          await prisma.systemUser.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date().toISOString() },
          }).catch(err => console.log('[AUTH] Failed to update lastLoginAt:', err.message));

          // Get tenant info if exists
          let tenant = null;
          if (user.tenantId) {
            tenant = await prisma.tenant.findUnique({
              where: { id: user.tenantId },
            }).catch(() => null);
          }

          console.log('[AUTH] Database login successful for:', user.email);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            tenantId: user.tenantId,
            tenantSlug: tenant?.slug || null,
            tenantName: tenant?.businessName || null,
            industrySlug: tenant?.industrySlug || null,
          };
        } catch (error) {
          console.error('[AUTH] Database error, demo auth also failed:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tenantId = user.tenantId;
        token.tenantSlug = user.tenantSlug;
        token.tenantName = user.tenantName;
        token.industrySlug = user.industrySlug;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.tenantId = token.tenantId as string | null;
        session.user.tenantSlug = token.tenantSlug as string | null;
        session.user.tenantName = token.tenantName as string | null;
        session.user.industrySlug = token.industrySlug as string | null;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`[AUTH] User signed in: ${user.email}`);
    },
  },
  debug: true,
};

// Type extensions for NextAuth
declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    tenantId: string | null;
    tenantSlug: string | null;
    tenantName: string | null;
    industrySlug: string | null;
  }
  interface Session {
    user: User & {
      id: string;
      email: string;
      name: string;
      role: string;
      tenantId: string | null;
      tenantSlug: string | null;
      tenantName: string | null;
      industrySlug: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    tenantId: string | null;
    tenantSlug: string | null;
    tenantName: string | null;
    industrySlug: string | null;
  }
}
