# NEXUSOS - CONTEXT TRANSFER PROMPT

## IMPORTANT INSTRUCTIONS
Copy and paste this entire document to a new chat. The assistant will understand the full project context and continue working on NexusOS without needing explanations of what was done.

---

## PROJECT OVERVIEW

**Project Name:** NexusOS
**Type:** Multi-tenant SaaS platform for Caribbean businesses
**Location:** `/home/z/my-project/`
**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS 4, Prisma, SQLite, NextAuth.js, shadcn/ui
**Deployment:** Vercel (https://nexus-os-alpha.vercel.app/)
**GitHub:** https://github.com/comandomorillo2026/NexusOS.git

---

## CURRENT STATE: PRODUCTION-READY SaaS (95% Complete)

### ✅ COMPLETED FEATURES

#### 1. Authentication System (100%)
- **NextAuth.js v4** with credentials provider
- **bcrypt** password hashing (12 rounds)
- JWT sessions (30 days expiry)
- Role-based access: SUPER_ADMIN, TENANT_ADMIN, TENANT_USER
- Industry-based redirection after login

**Files:**
- `/src/lib/auth/config.ts` - NextAuth configuration
- `/src/lib/auth/hooks.ts` - useAuth hook
- `/src/lib/auth/index.ts` - Server-side helpers
- `/src/app/api/auth/[...nextauth]/route.ts` - API route
- `/src/middleware.ts` - Route protection

**Demo Users (seeded in database):**
```
SUPER_ADMIN: admin@nexusos.tt / admin123
CLINIC: clinic@demo.tt / demo123
LAWYER: lawfirm@demo.tt / demo123
BEAUTY: beauty@demo.tt / demo123
```

#### 2. Multi-Tenant Isolation (100%)
- Middleware-based route protection
- Tenant context helpers in `/src/lib/tenant-context.ts`
- Protected route components: `ClinicRoute`, `LawfirmRoute`, `BeautyRoute`, `NurseRoute`, `AdminRoute`
- Data filtering by tenantId in APIs

#### 3. Registration System (100%)
- 3-step wizard at `/register`
- Automatic tenant creation with unique slug
- Plan selection (Starter/Growth/Premium)
- Industry selection (Clinic/Nurse/Lawfirm/Beauty)
- Auto-login after registration

**Files:**
- `/src/app/register/page.tsx`
- `/src/app/api/auth/register/route.ts`

#### 4. Email System (100%)
- Resend integration for transactional emails
- Welcome email template
- Password reset email template
- Development mode (logs instead of sending when no API key)

**Files:**
- `/src/lib/email/resend.ts`

#### 5. Payment Integration (100%)
- WiPay gateway for Caribbean (TT$ support)
- Fee calculation: 3% + TT$1 per transaction
- Webhook handler for payment confirmation
- Checkout success/cancel pages

**Files:**
- `/src/lib/payments/wipay.ts`
- `/src/app/api/payments/create/route.ts`
- `/src/app/api/webhooks/wipay/route.ts`
- `/src/app/checkout/success/page.tsx`
- `/src/app/checkout/cancel/page.tsx`

#### 6. Password Reset Flow (100%)
- Forgot password page
- Reset password with token (24h expiry)
- Email integration

**Files:**
- `/src/app/forgot-password/page.tsx`
- `/src/app/reset-password/page.tsx`
- `/src/app/api/auth/forgot-password/route.ts`
- `/src/app/api/auth/reset-password/route.ts`

---

## INDUSTRY MODULES

### 1. Clinic Module (`/clinic`)
- Dashboard with stats and charts
- Patients management
- Appointments with calendar
- Billing and invoices
- Prescriptions
- Lab module
- Inventory
- Reports
- Settings

### 2. Law Firm Module (`/lawfirm`)
- Dashboard
- Cases management
- Clients
- Documents with Trinidad & Tobago legal library
- Billing
- Trust Account (IOLTA)
- Time tracking
- Calendar
- Reports

### 3. Beauty Salon Module (`/beauty`)
- Dashboard
- Branches management
- Appointments
- Point of Sale (POS)
- Clients
- Staff
- Services
- Products
- Finances with TT tax system
- Reports

### 4. Nurse Portal (`/nurse`)
- Dashboard with shift info
- SBAR Shift Handoff
- Tasks management
- Vital Signs logging
- Medication Administration Record (MAR)
- Nursing Notes
- Protocols
- Checklists

### 5. Admin Portal (`/admin`)
- Control Tower for super admins
- Tenant management
- Lead management
- Price editor
- Invoice designer

---

## DATABASE SCHEMA

**Location:** `/prisma/schema.prisma`

**Key Models:**
- SystemUser (authentication)
- Tenant (multi-tenancy)
- Account, Session (NextAuth)
- SalesOrder, PaymentVerification (payments)
- Patient, Appointment, Invoice (clinic)
- LawCase, LawClient, LawInvoice (lawfirm)
- And 50+ more models

**Database:** SQLite at `/db/custom.db`

**Commands:**
```bash
bun run db:generate  # Generate Prisma client
bun run db:push      # Push schema changes
bun run db:seed      # Seed demo data
```

---

## ENVIRONMENT VARIABLES

**File:** `.env`

```env
DATABASE_URL=file:/home/z/my-project/db/custom.db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=nexusos-super-secret-key-change-in-production-2026

# Email (Resend)
RESEND_API_KEY=re_your_resend_api_key_here
EMAIL_FROM=noreply@nexusos.tt

# Payment (WiPay - Trinidad & Tobago)
WIPAY_API_KEY=your_wipay_api_key_here
WIPAY_ACCOUNT_NUMBER=your_account_number_here
WIPAY_API_URL=https://wipayfinancial.com/v1

# App Settings
APP_NAME=NexusOS
APP_URL=http://localhost:3000
```

---

## PROJECT STRUCTURE

```
/home/z/my-project/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/    # NextAuth API
│   │   │   ├── auth/register/         # Registration API
│   │   │   ├── auth/forgot-password/  # Password reset
│   │   │   ├── auth/reset-password/   # Password reset
│   │   │   ├── payments/create/       # WiPay payments
│   │   │   └── webhooks/wipay/        # Payment webhooks
│   │   ├── clinic/                    # Clinic dashboard
│   │   ├── lawfirm/                   # Law firm dashboard
│   │   ├── beauty/                    # Beauty salon dashboard
│   │   ├── nurse/                     # Nurse portal
│   │   ├── admin/                     # Admin control tower
│   │   ├── login/                     # Login page
│   │   ├── register/                  # Registration wizard
│   │   ├── forgot-password/           # Password recovery
│   │   ├── reset-password/            # Password reset
│   │   └── checkout/                  # Payment pages
│   ├── components/
│   │   ├── auth/                      # Auth components
│   │   ├── clinic/                    # Clinic modules
│   │   ├── lawfirm/                   # Law firm modules
│   │   ├── beauty/                    # Beauty modules
│   │   ├── admin/                     # Admin components
│   │   └── ui/                        # shadcn/ui components
│   └── lib/
│       ├── auth/                      # Auth configuration
│       ├── email/                     # Email service
│       ├── payments/                  # Payment service
│       └── db.ts                      # Prisma client
├── prisma/
│   ├── schema.prisma                  # Database schema
│   └── seed.ts                        # Demo data seed
├── db/
│   └── custom.db                      # SQLite database
└── worklog.md                         # Development log
```

---

## PENDING TASKS (If Needed)

1. **Stripe Integration** - For international payments (parallel to WiPay)
2. **Email Verification** - Require email confirmation before access
3. **2FA** - Two-factor authentication for security
4. **Tenant Subdomains** - Custom subdomain per tenant (e.g., clinic.nexusos.tt)
5. **Invoice PDF Generation** - Automatic PDF creation for invoices
6. **WhatsApp Notifications** - Integration for appointment reminders
7. **Audit Log Dashboard** - View activity logs in admin panel

---

## HOW TO CONTINUE

When continuing this project:

1. **Read the worklog:** `/home/z/my-project/worklog.md` contains detailed history
2. **Check the database:** Run `bun run db:seed` if users are missing
3. **Test authentication:** Use demo credentials above
4. **Build command:** `bun run build` - Should compile without errors
5. **Development:** `bun run dev` - Starts on port 3000

---

## KEY FILES TO KNOW

| File | Purpose |
|------|---------|
| `/src/middleware.ts` | Route protection and tenant isolation |
| `/src/lib/auth/config.ts` | NextAuth configuration with roles |
| `/src/lib/tenant-context.ts` | Tenant data filtering helpers |
| `/src/app/register/page.tsx` | 3-step registration wizard |
| `/src/lib/payments/wipay.ts` | WiPay Caribbean payment gateway |
| `/src/lib/email/resend.ts` | Email service with templates |
| `/prisma/schema.prisma` | 70+ database models |

---

## DESIGN SYSTEM

- **Theme:** Dark (Obsidian)
- **Primary Colors:** Purple (#6C3FCE), Magenta (#C026D3)
- **Secondary:** Gold (#F0B429), Cyan (#22D3EE)
- **UI Library:** shadcn/ui with custom glass-morphism cards
- **Fonts:** Cormorant Garamond (headings), DM Sans (body)
- **CSS:** Tailwind CSS with custom aurora background effect

---

## WHAT TO SAY TO THE ASSISTANT

"Continue working on NexusOS. The project is a multi-tenant SaaS platform at 95% completion. Read `/home/z/my-project/worklog.md` for full history. The authentication, payments, emails, and tenant isolation are complete. Check what needs improvement and implement any missing features. Use the demo credentials to test: admin@nexusos.tt / admin123"

---

END OF CONTEXT TRANSFER
