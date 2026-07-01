import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/lib/store";
import { clearCredentials, setCredentials, setUser } from "@/lib/auth-slice";
import type {
  ApiResponse,
  AuthPayload,
  AuthUser,
  AdminCommissionExpensesResponse,
  AdminGenerationCoinsResponse,
  AdminOrder,
  AdminUser,
  AdminPaymentsResponse,
  AdminWithdrawal,
  CommissionsResponse,
  DashboardResponse,
  EarningsResponse,
  NotificationItem,
  NotificationsResponse,
  PaginatedResponse,
  PayoutDetails,
  Product,
  ProductCountResponse,
  ProductImageUpload,
  ProductInput,
  ProductUpdateInput,
  ProfileUpdateInput,
  PurchaseResponse,
  PurchasedProductsResponse,
  ReferralsResponse,
  ReferralPlacementTokens,
  WingMemberDetailsResponse,
  WingsResponse,
} from "@/lib/api-types";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "https://giotobangladesh.com/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const unwrap = <T>(response: ApiResponse<T>) => response.data;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const payload = unwrap(refreshResult.data as ApiResponse<AuthPayload>);
      api.dispatch(setCredentials(payload));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearCredentials());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Products",
    "Dashboard",
    "Commissions",
    "Referrals",
    "Wings",
    "Earnings",
    "AdminUsers",
    "AdminWithdrawals",
    "AdminProducts",
    "AdminOrders",
    "Notifications",
    "PurchasedProducts",
  ],
  endpoints: (builder) => ({
    login: builder.mutation<AuthPayload, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: unwrap<AuthPayload>,
      invalidatesTags: ["Auth", "Dashboard"],
    }),
    register: builder.mutation<
      AuthPayload,
      {
        fullName: string;
        email: string;
        phone: string;
        password: string;
        referralCode?: string;
      }
    >({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      transformResponse: unwrap<AuthPayload>,
      invalidatesTags: ["Auth", "Dashboard"],
    }),
    logout: builder.mutation<{ loggedOut: boolean }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      transformResponse: unwrap<{ loggedOut: boolean }>,
      invalidatesTags: ["Auth"],
    }),
    getMe: builder.query<AuthUser, void>({
      query: () => "/auth/me",
      transformResponse: unwrap<AuthUser>,
      providesTags: ["Auth"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          // Auth refresh/logout is handled by baseQueryWithReauth.
        }
      },
    }),
    forgotPassword: builder.mutation<
      { identifier: string; sent: boolean },
      { email: string }
    >({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
      transformResponse: unwrap<{ identifier: string; sent: boolean }>,
    }),
    verifyOtp: builder.mutation<
      { identifier: string; resetToken: string },
      { identifier: string; otp: string }
    >({
      query: (body) => ({ url: "/auth/verify-otp", method: "POST", body }),
      transformResponse: unwrap<{ identifier: string; resetToken: string }>,
    }),
    resetPassword: builder.mutation<
      { updated: boolean },
      {
        identifier: string;
        password: string;
        resetToken?: string;
        otp?: string;
      }
    >({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
      transformResponse: unwrap<{ updated: boolean }>,
    }),
    updateProfile: builder.mutation<
      AuthUser,
      ProfileUpdateInput
    >({
      query: (body) => ({ url: "/auth/profile", method: "PATCH", body }),
      transformResponse: unwrap<AuthUser>,
      invalidatesTags: ["Auth", "Dashboard"],
    }),
    uploadProfilePicture: builder.mutation<ProductImageUpload, File>({
      query: (file) => {
        const body = new FormData();
        body.append("image", file);

        return {
          url: "/auth/profile-picture",
          method: "POST",
          body,
        };
      },
      transformResponse: unwrap<ProductImageUpload>,
    }),
    changePassword: builder.mutation<
      { updated: boolean },
      { current: string; next: string }
    >({
      query: (body) => ({ url: "/auth/password", method: "PATCH", body }),
      transformResponse: unwrap<{ updated: boolean }>,
    }),
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      transformResponse: unwrap<Product[]>,
      providesTags: ["Products"],
    }),
    getProductCount: builder.query<ProductCountResponse, void>({
      query: () => "/products/count",
      transformResponse: unwrap<ProductCountResponse>,
      providesTags: ["Products"],
    }),
    getProduct: builder.query<Product, string>({
      query: (productId) => `/products/${productId}`,
      transformResponse: unwrap<Product>,
      providesTags: (_result, _error, productId) => [
        { type: "Products", id: productId },
      ],
    }),
    createOrder: builder.mutation<
      PurchaseResponse,
      {
        productId: string;
        quantity: number;
        fullName: string;
        email: string;
        password: string;
        referralCode?: string;
        customerName: string;
        phone: string;
        address: string;
        paymentMethod: string;
      }
    >({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      transformResponse: unwrap<PurchaseResponse>,
      invalidatesTags: [
        "Auth",
        "Dashboard",
        "Commissions",
        "AdminOrders",
        "Notifications",
        "PurchasedProducts",
      ],
    }),
    getDashboard: builder.query<DashboardResponse, void>({
      query: () => "/dashboard",
      transformResponse: unwrap<DashboardResponse>,
      providesTags: ["Dashboard"],
    }),
    getNotifications: builder.query<NotificationsResponse, void>({
      query: () => "/dashboard/notifications",
      transformResponse: unwrap<NotificationsResponse>,
      providesTags: ["Notifications"],
    }),
    markNotificationRead: builder.mutation<NotificationItem, string>({
      query: (notificationId) => ({
        url: `/dashboard/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      transformResponse: unwrap<NotificationItem>,
      invalidatesTags: ["Notifications", "Dashboard"],
    }),
    markAllNotificationsRead: builder.mutation<
      { updated: number; readAt: string },
      void
    >({
      query: () => ({
        url: "/dashboard/notifications/read-all",
        method: "PATCH",
      }),
      transformResponse: unwrap<{ updated: number; readAt: string }>,
      invalidatesTags: ["Notifications", "Dashboard"],
    }),
    deleteNotification: builder.mutation<
      { deleted: boolean; id: string },
      string
    >({
      query: (notificationId) => ({
        url: `/dashboard/notifications/${notificationId}`,
        method: "DELETE",
      }),
      transformResponse: unwrap<{ deleted: boolean; id: string }>,
      invalidatesTags: ["Notifications", "Dashboard"],
    }),
    getCommissions: builder.query<CommissionsResponse, void>({
      query: () => "/dashboard/commissions",
      transformResponse: unwrap<CommissionsResponse>,
      providesTags: ["Commissions"],
    }),
    getReferrals: builder.query<ReferralsResponse, void>({
      query: () => "/dashboard/referrals",
      transformResponse: unwrap<ReferralsResponse>,
      providesTags: ["Referrals"],
    }),
    getWings: builder.query<WingsResponse, void>({
      query: () => "/dashboard/wings",
      transformResponse: unwrap<WingsResponse>,
      providesTags: ["Wings"],
    }),
    getWingMemberDetails: builder.query<WingMemberDetailsResponse, string>({
      query: (memberId) => `/dashboard/wings/members/${encodeURIComponent(memberId)}`,
      transformResponse: unwrap<WingMemberDetailsResponse>,
      providesTags: ["Wings"],
    }),
    assignWingPlacement: builder.mutation<
      {
        memberId: string;
        memberName: string;
        sponsorWing: "Left" | "Right";
        parentUserId: string;
        position: "Left" | "Right";
        placedAt: string;
      },
      {
        memberId: string;
        parentUserId: string;
        position: "Left" | "Right";
      }
    >({
      query: (body) => ({
        url: "/dashboard/wings/placements",
        method: "POST",
        body,
      }),
      transformResponse: unwrap<{
        memberId: string;
        memberName: string;
        sponsorWing: "Left" | "Right";
        parentUserId: string;
        position: "Left" | "Right";
        placedAt: string;
      }>,
      invalidatesTags: [
        "Wings",
        "Dashboard",
        "Referrals",
        "Commissions",
        "Notifications",
      ],
    }),
    getReferralPlacementTokens: builder.query<ReferralPlacementTokens, void>({
      query: () => "/dashboard/referral-placement-tokens",
      transformResponse: unwrap<ReferralPlacementTokens>,
    }),
    getEarnings: builder.query<EarningsResponse, void>({
      query: () => "/dashboard/earnings",
      transformResponse: unwrap<EarningsResponse>,
      providesTags: ["Earnings"],
    }),
    getPayments: builder.query<EarningsResponse, void>({
      query: () => "/dashboard/payments",
      transformResponse: unwrap<EarningsResponse>,
      providesTags: ["Earnings"],
    }),
    getPurchasedProducts: builder.query<
      PurchasedProductsResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
      } | void
    >({
      query: (params) => ({
        url: "/dashboard/purchased-products",
        params: params ?? undefined,
      }),
      transformResponse: unwrap<PurchasedProductsResponse>,
      providesTags: ["PurchasedProducts"],
    }),
    createWithdrawal: builder.mutation<
      { id: string },
      { amount: number; method: PayoutDetails["provider"]; account: string; payoutDetails: PayoutDetails }
    >({
      query: (body) => ({
        url: "/dashboard/withdrawals",
        method: "POST",
        body,
      }),
      transformResponse: unwrap<{ id: string }>,
      invalidatesTags: ["Earnings", "Dashboard", "Notifications"],
    }),
    getAdminUsers: builder.query<
      PaginatedResponse<AdminUser>,
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        role?: string;
      } | void
    >({
      query: (params) => ({ url: "/admin/users", params: params ?? undefined }),
      transformResponse: unwrap<PaginatedResponse<AdminUser>>,
      providesTags: ["AdminUsers"],
    }),
    updateAdminUserStatus: builder.mutation<
      AdminUser,
      { userId: string; status: AdminUser["status"] }
    >({
      query: ({ userId, status }) => ({
        url: `/admin/users/${userId}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: unwrap<AdminUser>,
      invalidatesTags: ["AdminUsers", "Notifications"],
    }),
    updateAdminUserRole: builder.mutation<
      AdminUser,
      { userId: string; role: AdminUser["role"] }
    >({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: "PATCH",
        body: { role },
      }),
      transformResponse: unwrap<AdminUser>,
      invalidatesTags: ["AdminUsers", "Auth", "Notifications"],
    }),
    creditAdminCommission: builder.mutation<
      { user: AdminUser; note: string },
      { user: string; amount: number; note: string }
    >({
      query: (body) => ({
        url: "/admin/commissions/credit",
        method: "POST",
        body,
      }),
      transformResponse: unwrap<{ user: AdminUser; note: string }>,
      invalidatesTags: ["AdminUsers", "Notifications"],
    }),
    getAdminCommissionExpenses: builder.query<
      AdminCommissionExpensesResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        type?: string;
        status?: string;
        month?: number;
        year?: number;
      } | void
    >({
      query: (params) => ({
        url: "/admin/commission-expenses",
        params: params ?? undefined,
      }),
      transformResponse: unwrap<AdminCommissionExpensesResponse>,
      providesTags: ["AdminUsers"],
    }),
    getAdminGenerationCoins: builder.query<
      AdminGenerationCoinsResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        coinStatus?: string;
      } | void
    >({
      query: (params) => ({
        url: "/admin/generation-coins",
        params: params ?? undefined,
      }),
      transformResponse: unwrap<AdminGenerationCoinsResponse>,
      providesTags: ["AdminUsers"],
    }),
    getAdminWithdrawals: builder.query<AdminWithdrawal[], void>({
      query: () => "/admin/withdrawals",
      transformResponse: unwrap<AdminWithdrawal[]>,
      providesTags: ["AdminWithdrawals"],
    }),
    getAdminPayments: builder.query<
      AdminPaymentsResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        method?: string;
        month?: number;
        year?: number;
      } | void
    >({
      query: (params) => ({
        url: "/admin/payments",
        params: params ?? undefined,
      }),
      transformResponse: unwrap<AdminPaymentsResponse>,
      providesTags: ["AdminWithdrawals", "AdminUsers"],
    }),
    updateAdminWithdrawalStatus: builder.mutation<
      AdminWithdrawal,
      { withdrawalId: string; status: AdminWithdrawal["status"] }
    >({
      query: ({ withdrawalId, status }) => ({
        url: `/admin/withdrawals/${withdrawalId}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: unwrap<AdminWithdrawal>,
      invalidatesTags: [
        "AdminWithdrawals",
        "AdminUsers",
        "Earnings",
        "Dashboard",
        "Notifications",
      ],
    }),
    getAdminOrders: builder.query<
      PaginatedResponse<AdminOrder>,
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        method?: string;
      } | void
    >({
      query: (params) => ({
        url: "/admin/orders",
        params: params ?? undefined,
      }),
      transformResponse: unwrap<PaginatedResponse<AdminOrder>>,
      providesTags: ["AdminOrders"],
    }),
    updateAdminOrderStatus: builder.mutation<
      AdminOrder,
      { orderId: string; status: AdminOrder["status"] }
    >({
      query: ({ orderId, status }) => ({
        url: `/admin/orders/${orderId}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: unwrap<AdminOrder>,
      invalidatesTags: [
        "AdminOrders",
        "Dashboard",
        "Commissions",
        "Notifications",
        "PurchasedProducts",
      ],
    }),
    broadcastNotification: builder.mutation<
      { delivered: boolean },
      { message: string }
    >({
      query: (body) => ({ url: "/admin/broadcasts", method: "POST", body }),
      transformResponse: unwrap<{ delivered: boolean }>,
      invalidatesTags: ["Notifications", "Dashboard"],
    }),
    getAdminProducts: builder.query<
      PaginatedResponse<Product>,
      {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
      } | void
    >({
      query: (params) => ({
        url: "/admin/products",
        params: params ?? undefined,
      }),
      transformResponse: unwrap<PaginatedResponse<Product>>,
      providesTags: ["AdminProducts"],
    }),
    getAdminProduct: builder.query<Product, string>({
      query: (productId) => `/admin/products/${productId}`,
      transformResponse: unwrap<Product>,
      providesTags: (_result, _error, productId) => [
        { type: "AdminProducts", id: productId },
      ],
    }),
    createAdminProduct: builder.mutation<Product, ProductInput>({
      query: (body) => ({ url: "/admin/products", method: "POST", body }),
      transformResponse: unwrap<Product>,
      invalidatesTags: ["AdminProducts", "Products"],
    }),
    updateAdminProduct: builder.mutation<
      Product,
      { productId: string; body: ProductUpdateInput }
    >({
      query: ({ productId, body }) => ({
        url: `/admin/products/${productId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: unwrap<Product>,
      invalidatesTags: (_result, _error, { productId }) => [
        "AdminProducts",
        "Products",
        { type: "AdminProducts", id: productId },
        { type: "Products", id: productId },
      ],
    }),
    deleteAdminProduct: builder.mutation<
      { deleted: boolean; productId: string },
      string
    >({
      query: (productId) => ({
        url: `/admin/products/${productId}`,
        method: "DELETE",
      }),
      transformResponse: unwrap<{ deleted: boolean; productId: string }>,
      invalidatesTags: (_result, _error, productId) => [
        "AdminProducts",
        "Products",
        { type: "AdminProducts", id: productId },
        { type: "Products", id: productId },
      ],
    }),
    uploadAdminProductImage: builder.mutation<ProductImageUpload, File>({
      query: (file) => {
        const body = new FormData();
        body.append("image", file);

        return {
          url: "/admin/uploads/images",
          method: "POST",
          body,
        };
      },
      transformResponse: unwrap<ProductImageUpload>,
    }),
  }),
});

export const {
  useAssignWingPlacementMutation,
  useChangePasswordMutation,
  useCreateOrderMutation,
  useCreateAdminProductMutation,
  useCreditAdminCommissionMutation,
  useBroadcastNotificationMutation,
  useCreateWithdrawalMutation,
  useForgotPasswordMutation,
  useDeleteAdminProductMutation,
  useDeleteNotificationMutation,
  useGetCommissionsQuery,
  useGetDashboardQuery,
  useGetEarningsQuery,
  useGetMeQuery,
  useGetNotificationsQuery,
  useGetPaymentsQuery,
  useGetAdminUsersQuery,
  useGetAdminProductQuery,
  useGetAdminCommissionExpensesQuery,
  useGetAdminGenerationCoinsQuery,
  useGetAdminOrdersQuery,
  useGetAdminProductsQuery,
  useGetAdminPaymentsQuery,
  useGetAdminWithdrawalsQuery,
  useGetProductQuery,
  useGetProductCountQuery,
  useGetProductsQuery,
  useGetPurchasedProductsQuery,
  useGetReferralsQuery,
  useGetReferralPlacementTokensQuery,
  useGetWingMemberDetailsQuery,
  useGetWingsQuery,
  useLoginMutation,
  useLogoutMutation,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useUpdateAdminProductMutation,
  useUploadAdminProductImageMutation,
  useUpdateAdminOrderStatusMutation,
  useUpdateAdminUserStatusMutation,
  useUpdateAdminUserRoleMutation,
  useUpdateAdminWithdrawalStatusMutation,
  useUpdateProfileMutation,
  useUploadProfilePictureMutation,
  useVerifyOtpMutation,
} = api;
