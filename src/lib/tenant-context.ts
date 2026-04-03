import { headers } from 'next/headers';
import { getAuthSession } from './auth';

/**
 * Get the current user's tenant context
 * Use this in API routes to ensure data isolation
 */
export async function getTenantContext() {
  const session = await getAuthSession();

  if (!session?.user) {
    return { user: null, tenantId: null, isSuperAdmin: false };
  }

  const user = session.user;
  const isSuperAdmin = user.role === 'SUPER_ADMIN';

  // Get tenant ID from headers (set by middleware) or session
  const headersList = await headers();
  const headerTenantId = headersList.get('x-tenant-id');
  const tenantId = headerTenantId || user.tenantId;

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    tenantId,
    isSuperAdmin,
    industrySlug: user.industrySlug,
  };
}

/**
 * Build a where clause that ensures tenant isolation
 * Super admins can see all data, others only see their tenant's data
 */
export function tenantWhereClause(tenantId: string | null, isSuperAdmin: boolean) {
  if (isSuperAdmin) {
    return {}; // Super admin can see all
  }

  if (!tenantId) {
    throw new Error('Tenant ID is required for non-super-admin users');
  }

  return { tenantId };
}

/**
 * Require tenant access - throws if user doesn't have access
 */
export async function requireTenantAccess(tenantId: string) {
  const context = await getTenantContext();

  if (!context.user) {
    throw new Error('Unauthorized');
  }

  if (context.isSuperAdmin) {
    return context; // Super admin can access any tenant
  }

  if (context.tenantId !== tenantId) {
    throw new Error('Forbidden: You do not have access to this tenant');
  }

  return context;
}

/**
 * Add tenant ID to data when creating records
 */
export function withTenantId<T extends Record<string, unknown>>(
  data: T,
  tenantId: string | null,
  isSuperAdmin: boolean
): T & { tenantId: string } {
  if (isSuperAdmin && !tenantId) {
    throw new Error('Tenant ID is required when creating records as super admin');
  }

  if (!tenantId) {
    throw new Error('Tenant ID is required');
  }

  return {
    ...data,
    tenantId,
  };
}
