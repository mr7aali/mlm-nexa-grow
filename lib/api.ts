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
  AdminUser,
  AdminWithdrawal,
  CommissionsResponse,
  DashboardResponse,
  EarningsResponse,
  Order,
  PaginatedResponse,
  Product,
  ProductImageUpload,
  ProductInput,
  ProductUpdateInput,
  ReferralsResponse,
  WingsResponse,
} from "@/lib/api-types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

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
      { identifier: string; otp: string },
      { email: string }
    >({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
      transformResponse: unwrap<{ identifier: string; otp: string }>,
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
      { identifier: string; password: string; resetToken?: string; otp?: string }
    >({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
      transformResponse: unwrap<{ updated: boolean }>,
    }),
    updateProfile: builder.mutation<
      AuthUser,
      { fullName: string; phone: string }
    >({
      query: (body) => ({ url: "/auth/profile", method: "PATCH", body }),
      transformResponse: unwrap<AuthUser>,
      invalidatesTags: ["Auth", "Dashboard"],
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
    getProduct: builder.query<Product, string>({
      query: (productId) => `/products/${productId}`,
      transformResponse: unwrap<Product>,
      providesTags: (_result, _error, productId) => [
        { type: "Products", id: productId },
      ],
    }),
    createOrder: builder.mutation<
      Order,
      {
        productId: string;
        quantity: number;
        customerName: string;
        phone: string;
        address: string;
        paymentMethod: string;
      }
    >({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      transformResponse: unwrap<Order>,
    }),
    getDashboard: builder.query<DashboardResponse, void>({
      query: () => "/dashboard",
      transformResponse: unwrap<DashboardResponse>,
      providesTags: ["Dashboard"],
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
    getEarnings: builder.query<EarningsResponse, void>({
      query: () => "/dashboard/earnings",
      transformResponse: unwrap<EarningsResponse>,
      providesTags: ["Earnings"],
    }),
    createWithdrawal: builder.mutation<
      { id: string },
      { amount: number; method: string; account: string }
    >({
      query: (body) => ({ url: "/dashboard/withdrawals", method: "POST", body }),
      transformResponse: unwrap<{ id: string }>,
      invalidatesTags: ["Earnings", "Dashboard"],
    }),
    getAdminUsers: builder.query<
      PaginatedResponse<AdminUser>,
      { page?: number; limit?: number; search?: string; status?: string; role?: string } | void
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
      invalidatesTags: ["AdminUsers"],
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
      invalidatesTags: ["AdminUsers", "Auth"],
    }),
    creditAdminCommission: builder.mutation<
      { user: AdminUser; note: string },
      { user: string; amount: number; note: string }
    >({
      query: (body) => ({ url: "/admin/commissions/credit", method: "POST", body }),
      transformResponse: unwrap<{ user: AdminUser; note: string }>,
      invalidatesTags: ["AdminUsers"],
    }),
    getAdminWithdrawals: builder.query<AdminWithdrawal[], void>({
      query: () => "/admin/withdrawals",
      transformResponse: unwrap<AdminWithdrawal[]>,
      providesTags: ["AdminWithdrawals"],
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
      invalidatesTags: ["AdminWithdrawals"],
    }),
    broadcastNotification: builder.mutation<
      { delivered: boolean },
      { message: string }
    >({
      query: (body) => ({ url: "/admin/broadcasts", method: "POST", body }),
      transformResponse: unwrap<{ delivered: boolean }>,
    }),
    getAdminProducts: builder.query<
      PaginatedResponse<Product>,
      { page?: number; limit?: number; search?: string; category?: string } | void
    >({
      query: (params) => ({ url: "/admin/products", params: params ?? undefined }),
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
    deleteAdminProduct: builder.mutation<{ deleted: boolean; productId: string }, string>({
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
  useChangePasswordMutation,
  useCreateOrderMutation,
  useCreateAdminProductMutation,
  useCreditAdminCommissionMutation,
  useBroadcastNotificationMutation,
  useCreateWithdrawalMutation,
  useForgotPasswordMutation,
  useDeleteAdminProductMutation,
  useGetCommissionsQuery,
  useGetDashboardQuery,
  useGetEarningsQuery,
  useGetMeQuery,
  useGetAdminUsersQuery,
  useGetAdminProductQuery,
  useGetAdminProductsQuery,
  useGetAdminWithdrawalsQuery,
  useGetProductQuery,
  useGetProductsQuery,
  useGetReferralsQuery,
  useGetWingsQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useUpdateAdminProductMutation,
  useUploadAdminProductImageMutation,
  useUpdateAdminUserStatusMutation,
  useUpdateAdminUserRoleMutation,
  useUpdateAdminWithdrawalStatusMutation,
  useUpdateProfileMutation,
  useVerifyOtpMutation,
} = api;
