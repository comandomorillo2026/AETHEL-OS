// Main auth exports - this file provides both client and server auth utilities
export { useAuth, AuthProvider } from './auth/hooks';
export { authOptions } from './auth/config';
export { getAuthSession, getCurrentUser, requireAuth, requireSuperAdmin, requireTenantAccess } from './auth/index';
