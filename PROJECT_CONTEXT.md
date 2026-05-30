# Nexa Grow / GIOTO Bangladesh Project Context

This document is a handoff guide for another AI agent or developer working on this project.

## Quick Answer: Roles

There are 3 roles in this project:

- `member`
- `admin`
- `super-admin`

The role type is defined in:

- `backend/src/types/domain.ts`
- `lib/api-types.ts`

The MongoDB user schema also allows the same three values in `backend/src/database/models.ts`.

## Project Summary

Nexa Grow is a Next.js frontend plus Express/TypeScript backend for an MLM/referral commerce business. It supports:

- Public homepage and public product catalog.
- Member registration/login with referral code support.
- Member dashboard for referrals, wings/network, commissions, earnings, withdrawals, products, and profile.
- Admin/super-admin management for users, products, payments/withdrawals, manual commission credit, and broadcast notifications.
- MongoDB as the database.
- Cloudinary for product image uploads.
- Redux Toolkit Query for frontend API integration.

## Tech Stack

Frontend:

- Next.js `14.2.35`
- React `18.3.1`
- TypeScript
- Redux Toolkit / RTK Query
- React Redux
- React Hook Form
- Zod
- Tailwind CSS
- Lucide React icons
- Recharts

Backend:

- Express `5`
- TypeScript
- MongoDB with Mongoose
- JWT access token + refresh token auth
- HTTP-only refresh token cookie
- bcryptjs for password hashing
- Multer for multipart image upload
- Cloudinary for image storage
- Zod request validation

## Important Commands

Frontend:

```bash
npm run dev
npm run build
```

Backend:

```bash
cd backend
npm run dev
npm run typecheck
npm run build
npm run seed:super-admin
```

Seeded super-admin default credentials:

```txt
Email: superadmin@giotobangladesh.com
Password: SuperAdmin@12345
```

The seed script is idempotent and lives at:

- `backend/src/scripts/seed-super-admin.ts`

## Environment Variables

Backend env is read in `backend/src/config/env.ts`.

Required/relevant backend `.env` values:

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/nexa-grow
ACCESS_TOKEN_SECRET=replace-with-a-long-access-token-secret
REFRESH_TOKEN_SECRET=replace-with-a-long-refresh-token-secret
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
MAIL_FROM="GIOTO Bangladesh <no-reply@giotobangladesh.com>"
```

Frontend API base:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

If unset, frontend defaults to:

```txt
http://localhost:5000/api
```

## Auth Flow

Files:

- `backend/src/modules/auth/auth.routes.ts`
- `backend/src/modules/auth/auth.service.ts`
- `backend/src/middleware/auth.middleware.ts`
- `lib/auth-slice.ts`
- `lib/api.ts`

Flow:

- Login returns an access token and public user object. New member registration is created through product checkout only.
- Refresh token is stored as HTTP-only cookie named `gioto_refresh_token`.
- Frontend stores access token/user in Redux auth slice.
- RTK Query attaches access token as `Authorization: Bearer <token>`.
- On `401`, `baseQueryWithReauth` calls `/api/auth/refresh`, updates Redux credentials, then retries the original request.
- `requireAuth` validates access token and loads user from MongoDB.
- Banned users are blocked by auth middleware.
- Forgot-password OTPs are generated randomly, hashed in MongoDB, expire after 10 minutes, and are sent by SMTP email.
- OTPs are never returned from the API response.

Role middleware:

- `requireRole(role)`
- `requireAnyRole(roles)`

Admin routes currently allow:

```ts
requireAnyRole(["admin", "super-admin"])
```

## Frontend Route Map

Public pages:

- `/` - Homepage, public marketing/catalog preview.
- `/products` - Public product catalog.
- `/products/[productId]` - Public product details.
- `/products/[productId]/checkout` - Public checkout form.
- `/privacy-policy` - Static policy page.
- `/terms-and-conditions` - Static terms page.

Auth pages:

- `/login` - Login page.
- `/register` - Redirects to `/products`; standalone signup is disabled. Members are created only during product checkout.
- `/forgot-password` - Request OTP.
- `/otp-verification` - OTP verify page.
- `/reset-password` - Reset password page.

Shared dashboard pages:

- `/dashboard` - Dynamic dashboard. Members see referral/commission stats; admin/super-admin see users/products/payments operational overview.
- `/dashboard/profile` - Dynamic profile. Members see referral/balance details; admin/super-admin see management profile details and admin shortcuts.

Member-only dashboard pages:

- `/dashboard/wings` - Network/wings tree.
- `/dashboard/referrals` - Direct referrals.
- `/dashboard/commissions` - Commission progress/history.
- `/dashboard/products` - Dashboard product catalog.
- `/dashboard/products/[productId]` - Dashboard product detail.
- `/dashboard/earnings` - Balance, earnings chart, withdrawals.
- `/dashboard/payments` - Member-only payment/transaction history and money request page.

Admin/super-admin pages:

- `/dashboard/super-admin/users` - User management, role/status updates, user current balance.
- `/dashboard/super-admin/products` - Product CRUD, Cloudinary image upload/replace, pagination/filtering.
- `/dashboard/super-admin/payments` - Payment/withdrawal transaction history and status management.

Legacy/admin page:

- `/admin` - Older admin panel. It still exists and uses admin APIs.

Dashboard layout:

- `app/dashboard/layout.tsx`
- `components/dashboard-shell.tsx`

Sidebar behavior:

- Members see normal dashboard links.
- `admin` and `super-admin` see dashboard/profile plus:
  - User management
  - Product management
  - Payments
- `admin` and `super-admin` are redirected away from member-only pages:
  - `/dashboard/wings`
  - `/dashboard/referrals`
  - `/dashboard/commissions`
  - `/dashboard/products`
  - `/dashboard/earnings`
  - `/dashboard/payments`

## Frontend API Layer

Main file:

- `lib/api.ts`

Type file:

- `lib/api-types.ts`

RTK Query tag groups:

- `Auth`
- `Products`
- `Dashboard`
- `Commissions`
- `Referrals`
- `Wings`
- `Earnings`
- `AdminUsers`
- `AdminWithdrawals`
- `AdminProducts`

Important hooks:

Auth:

- `useLoginMutation`
- `useRegisterMutation`
- `useLogoutMutation`
- `useGetMeQuery`
- `useForgotPasswordMutation`
- `useVerifyOtpMutation`
- `useResetPasswordMutation`
- `useUpdateProfileMutation`
- `useChangePasswordMutation`

Products/orders:

- `useGetProductsQuery`
- `useGetProductQuery`
- `useCreateOrderMutation`

Dashboard:

- `useGetDashboardQuery`
- `useGetCommissionsQuery`
- `useGetReferralsQuery`
- `useGetWingsQuery`
- `useGetEarningsQuery`
- `useCreateWithdrawalMutation`

Admin:

- `useGetAdminUsersQuery`
- `useUpdateAdminUserStatusMutation`
- `useUpdateAdminUserRoleMutation`
- `useCreditAdminCommissionMutation`
- `useBroadcastNotificationMutation`
- `useGetAdminWithdrawalsQuery`
- `useGetAdminPaymentsQuery`
- `useUpdateAdminWithdrawalStatusMutation`
- `useGetAdminProductsQuery`
- `useGetAdminProductQuery`
- `useCreateAdminProductMutation`
- `useUpdateAdminProductMutation`
- `useDeleteAdminProductMutation`
- `useUploadAdminProductImageMutation`

## Backend Entry Points

Main app:

- `backend/src/app.ts`

Server:

- `backend/src/server.ts`

Mounted API routers:

```txt
/api/auth      -> backend/src/modules/auth/auth.routes.ts
/api/products  -> backend/src/modules/products/products.routes.ts
/api/orders    -> inline in backend/src/app.ts
/api/dashboard -> backend/src/modules/dashboard/dashboard.routes.ts
/api/admin     -> backend/src/modules/admin/admin.routes.ts
```

Health check:

```txt
GET /api/health
```

## Backend API Surface

Auth:

```txt
POST  /api/auth/register       # Disabled; returns 410. Use product checkout.
POST  /api/auth/login
POST  /api/auth/refresh
POST  /api/auth/logout
GET   /api/auth/me
POST  /api/auth/forgot-password
POST  /api/auth/verify-otp
POST  /api/auth/reset-password
PATCH /api/auth/profile
PATCH /api/auth/password
```

Public products/orders:

```txt
GET  /api/products
GET  /api/products/:productId
POST /api/orders        # Product purchase + member registration
```

Member dashboard:

```txt
GET  /api/dashboard
GET  /api/dashboard/commissions
GET  /api/dashboard/referrals
GET  /api/dashboard/wings
GET  /api/dashboard/earnings
GET  /api/dashboard/payments
POST /api/dashboard/withdrawals
```

The member-only dashboard APIs are protected with `requireRole("member")`:

- `/api/dashboard/commissions`
- `/api/dashboard/referrals`
- `/api/dashboard/wings`
- `/api/dashboard/earnings`
- `/api/dashboard/payments`
- `POST /api/dashboard/withdrawals`

Admin/super-admin:

```txt
GET    /api/admin/users
PATCH  /api/admin/users/:userId/status
PATCH  /api/admin/users/:userId/role
POST   /api/admin/commissions/credit

GET    /api/admin/products
GET    /api/admin/products/:productId
POST   /api/admin/products
PATCH  /api/admin/products/:productId
DELETE /api/admin/products/:productId
POST   /api/admin/uploads/images

GET    /api/admin/withdrawals
GET    /api/admin/payments
PATCH  /api/admin/withdrawals/:withdrawalId/status
POST   /api/admin/broadcasts
```

Pagination pattern:

```txt
?page=1&limit=10
```

Paginated responses use:

```ts
{
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## Data Models

All MongoDB models are in:

- `backend/src/database/models.ts`

Important models:

- `User`
- `RefreshToken`
- `Product`
- `Order`
- `Withdrawal`
- `CommissionLevel`
- `Referral`
- `Activity`
- `CommissionHistory`
- `EarningsMonth`
- `Notification`
- `ReferralTree`

Important domain types:

- `backend/src/types/domain.ts`

## User Model Notes

Public user fields:

```ts
{
  id: string;
  name: string;
  email: string;
  phone: string;
  level: number;
  status: "Active" | "Inactive" | "Banned";
  referralCode: string;
  joined: string;
  earned: number;
  referrals: number;
  role: "member" | "admin" | "super-admin";
}
```

Private/internal fields include:

- `passwordHash`
- `referredByUserId`
- `referredByCode`
- reset OTP/token fields

## Balance / Payments Flow

Current balance is calculated as:

```txt
user.earned - sum(Paid withdrawals)
```

Locations:

- User profile balance: `/dashboard/profile`
- User earnings/withdrawals: `/dashboard/earnings`
- Member payment/transaction history and money request: `/dashboard/payments`
- Super-admin user balance column: `/dashboard/super-admin/users`
- Super-admin payment history: `/dashboard/super-admin/payments`

Withdrawal behavior:

- Members submit withdrawal requests from `/dashboard/earnings`.
- Minimum withdrawal is `200`.
- Backend rejects withdrawal requests greater than current balance.
- Withdrawal statuses:
  - `Pending`
  - `Review`
  - `Paid`
  - `Rejected`
- Super-admin can update withdrawal/payment status from `/dashboard/super-admin/payments`.

## Product / Image Flow

Public products are stored in MongoDB `Product` collection.

Product management page:

- `/dashboard/super-admin/products`

CRUD features:

- List products with pagination/filtering.
- Create product.
- Edit product.
- Delete product.
- View public product page.
- Upload/replace product image.

Cloudinary upload:

- Backend route: `POST /api/admin/uploads/images`
- Multipart form-data field name: `image`
- Uses Multer memory storage.
- Uploads to Cloudinary folder `nexa-grow/products`.
- Response includes `url` and `publicId`.
- Frontend stores returned `url` as `product.image`.

Important bug fix:

- Product updates use MongoDB `$set` via `findOneAndUpdate`.
- This is necessary because `Product` schema is `strict: false`; direct assignment may not persist dynamic fields like `image`.

## Referral / MLM Flow

Registration is only performed during product checkout and supports optional `referralCode`.

Standalone registration behavior:

- `/register` redirects to `/products`.
- `POST /api/auth/register` returns `410` and is disabled for direct signup.
- `POST /api/orders` validates checkout + registration fields, creates a member account, sets auth tokens, and creates the order.
- Checkout accepts referral codes like `00000` in the `referralCode` field.

If a valid sponsor code is provided:

- New user is linked with `referredByUserId` and `referredByCode`.
- A referral row is created for the sponsor.
- An activity row is created for the sponsor.
- Sponsor referral count is updated.

Dashboard referral/network data is generated from:

- `ReferralModel`
- recursive downline counting in `backend/src/modules/dashboard/dashboard.service.ts`

Commission plan is currently hardcoded in:

- `backend/src/modules/dashboard/dashboard.service.ts`

Levels:

- Level 1: required 6, earning 200
- Level 2: required 36, earning 600
- Level 3: required 216, earning 2000
- Level 4: required 1296, earning 10000
- Level 5: required 7776, earning 50000
- Level 6: required 46656, earning 300000

## Admin Capabilities

Admin and super-admin currently share access to `/api/admin/*`.

Admin/super-admin can:

- View users.
- Filter users by search/status/role.
- Update user status.
- Update user role.
- Credit manual commission.
- View withdrawals.
- View payment history.
- Update payment/withdrawal status.
- Send broadcast notifications.
- CRUD products.
- Upload product images to Cloudinary.

Super-admin UI pages are under:

- `app/dashboard/super-admin/*`

Note: despite the route name `super-admin`, the sidebar currently shows these links to both `admin` and `super-admin`.

## Response Shape

Backend success responses use:

```ts
{
  success: true;
  message: string;
  data: T;
}
```

Utility:

- `backend/src/utils/api-response.ts`

Errors use:

- `backend/src/utils/http-error.ts`
- `backend/src/middleware/error.middleware.ts`

Frontend error parsing:

- `lib/api-error.ts`

## Styling / UI Notes

Shared components:

- `components/ui.tsx`
- `components/brand-logo.tsx`
- `components/dashboard-shell.tsx`

Design language:

- Gold/orange GIOTO style.
- Rounded cards and buttons.
- Bengali UI copy in dashboard/public pages.
- Existing page designs should be preserved when adding API integration.

Next image config:

- `next.config.mjs`
- `next.config.ts`

Remote/runtime image issue was handled by setting:

```ts
images: {
  unoptimized: true;
}
```

## Known Operational Notes

- Restart frontend after changing Next config.
- Restart backend after adding/changing backend routes or env values.
- Cloudinary upload requires all Cloudinary env values.
- Product image upload can succeed independently from product update; the product only changes after the returned Cloudinary URL is sent in `POST /api/admin/products` or `PATCH /api/admin/products/:productId`.
- Public product pages depend on product `id`; avoid changing product IDs after creation.
- Admin payment history is built from withdrawal records.
- Current balance is not a stored field; it is calculated from user earnings and paid withdrawals.

## Key Files To Read First

For frontend API behavior:

- `lib/api.ts`
- `lib/api-types.ts`
- `lib/auth-slice.ts`
- `components/redux-provider.tsx`

For backend routes:

- `backend/src/app.ts`
- `backend/src/modules/auth/auth.routes.ts`
- `backend/src/modules/dashboard/dashboard.routes.ts`
- `backend/src/modules/admin/admin.routes.ts`
- `backend/src/modules/products/products.routes.ts`

For auth:

- `backend/src/modules/auth/auth.service.ts`
- `backend/src/middleware/auth.middleware.ts`

For data:

- `backend/src/database/models.ts`
- `backend/src/types/domain.ts`

For admin pages:

- `app/dashboard/super-admin/users/page.tsx`
- `app/dashboard/super-admin/products/page.tsx`
- `app/dashboard/super-admin/payments/page.tsx`

For member pages:

- `app/dashboard/page.tsx`
- `app/dashboard/profile/page.tsx`
- `app/dashboard/earnings/page.tsx`
- `app/dashboard/referrals/page.tsx`
- `app/dashboard/wings/page.tsx`
- `app/dashboard/commissions/page.tsx`
