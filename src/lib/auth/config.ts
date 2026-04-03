import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '../db';

export const authOptions: NextAuthOptions = {
  // NOTE: No PrismaAdapter when using JWT strategy
  // The adapter is only needed for database sessions
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

        try {
          // Find user in database
          const user = await prisma.systemUser.findUnique({
            where: { email: credentials.email },
          });

          console.log('[AUTH] User found:', user ? user.email : 'NOT FOUND');

          if (!user || !user.isActive) {
            console.log('[AUTH] User not found or inactive');
            return null;
          }

          // Verify password
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
            }).catch(err => {
              console.log('[AUTH] Failed to get tenant:', err.message);
              return null;
            });
          }

          console.log('[AUTH] Login successful for:', user.email);

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
          console.error('[AUTH] Error in authorize:', error);
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
  debug: true, // Always enable debug for troubleshooting
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
