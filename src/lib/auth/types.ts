// Auth types

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'TENANT_ADMIN' | 'TENANT_USER';
  tenantId?: string;
  tenantSlug?: string;
  tenantName?: string;
  industrySlug?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
