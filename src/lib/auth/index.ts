// Re-export auth configuration
export { authOptions } from './config';

// Server-side auth helpers
import { getServerSession } from 'next-auth/next';
import { authOptions } from './config';

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getAuthSession();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireSuperAdmin() {
  const user = await requireAuth();
  if (user.role !== 'SUPER_ADMIN') {
    throw new Error('Forbidden: Super Admin only');
  }
  return user;
}

export async function requireTenantAccess(tenantId: string) {
  const user = await requireAuth();
  if (user.role === 'SUPER_ADMIN') {
    return user; // Super admin can access all tenants
  }
  if (user.tenantId !== tenantId) {
    throw new Error('Forbidden: Tenant access denied');
  }
  return user;
}
