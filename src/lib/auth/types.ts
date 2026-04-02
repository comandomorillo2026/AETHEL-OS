// Auth Context - Simple but secure
// Handles both Admin and Tenant authentication

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'TENANT_ADMIN' | 'TENANT_USER';
  tenantId?: string;
  tenantSlug?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Demo users for development
export const DEMO_USERS: Record<string, User> = {
  'admin@nexusos.tt': {
    id: 'admin-001',
    email: 'admin@nexusos.tt',
    name: 'Super Admin',
    role: 'SUPER_ADMIN',
  },
  'clinic@demo.tt': {
    id: 'tenant-001',
    email: 'clinic@demo.tt',
    name: 'Clínica Demo',
    role: 'TENANT_ADMIN',
    tenantId: 'clinic-001',
    tenantSlug: 'clinica-demo',
  },
};

// Password verification (in production, use bcrypt + database)
export const DEMO_PASSWORDS: Record<string, string> = {
  'admin@nexusos.tt': 'admin123',
  'clinic@demo.tt': 'demo123',
};
