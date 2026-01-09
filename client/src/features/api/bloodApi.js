/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bloodApi = createApi({
    reducerPath: "bloodApi",

    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000/api",
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            // FIX: Check both localStorage AND Redux store for token
            let token = localStorage.getItem("token");

            // If token not in localStorage, try to get from Redux store
            if (!token) {
                const state = getState();
                token = state.auth?.token;
            }

            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),

    tagTypes: [
        "Request",
        "Notifications",
        "DonorNotifications",
        "DonorMatches",
        "Donor",
        "Donors",
        "Profile",
        "User"
    ],

    endpoints: (builder) => ({

        /* ------------------------------------------------------------------
            USER AUTH
        ------------------------------------------------------------------ */

        registerUser: builder.mutation({
            query: (data) => ({
                url: '/auth/register',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Donors']
        }),

        loginUser: builder.mutation({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Donors']
        }),

        getProfile: builder.query({
            query: () => ({
                url: '/user/profile',
                method: 'GET'
            }),
            providesTags: ['Profile', 'User'],
        }),

        updateUser: builder.mutation({
            query: (data) => ({
                url: '/user/profile',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Profile', 'User'], // FIX: Added 'User' tag
        }),

        activateRole: builder.mutation({
            query: ({ roleToActivate }) => ({
                url: '/user/activate-role',
                method: 'POST',
                body: { roleToActivate },
            }),
            // FIX: Added cache update logic for role activation
            invalidatesTags: ['User', 'Profile'], // Invalidate user and profile data
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success && data.data?.token) {
                        // Update token in localStorage
                        localStorage.setItem('token', data.data.token);
                    }
                } catch (error) {
                    console.error('Failed to update token after role activation:', error);
                }
            },
        }),

        /* ------------------------------------------------------------------
            PATIENT REQUESTS
        ------------------------------------------------------------------ */
        createRequest: builder.mutation({
            query: (data) => ({
                url: "/request/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Request"],
        }),

        getPatientRequests: builder.query({
            query: (patientId) => `/request/patient/${patientId}/requests`,
            providesTags: ["Request"],
        }),

        getSingleRequest: builder.query({
            query: (id) => `/request/single/${id}`,
            providesTags: ["Request"],
        }),

        /* ------------------------------------------------------------------
            DONOR AUTH
        ------------------------------------------------------------------ */
        registerDonor: builder.mutation({
            query: (data) => ({
                url: "/donor/register",
                method: "POST",
                body: data,
            }),
        }),

        loginDonor: builder.mutation({
            query: (data) => ({
                url: "/donor/login",
                method: "POST",
                body: data,
            }),
        }),

        getAllDonors: builder.query({
            query: () => "/donor/all",
            providesTags: ["Donors"]
        }),

        updateAvailability: builder.mutation({
            query: ({ id, available }) => ({
                url: `/donor/availability/${id}`,
                method: "PUT",
                body: { available },
            }),
            invalidatesTags: ["Donor"],
        }),

        /* ------------------------------------------------------------------
            DONOR MATCHED REQUESTS
        ------------------------------------------------------------------ */
        getDonorMatches: builder.query({
            query: () => "/request/donor/matches",
            providesTags: ["DonorMatches"],
        }),

        donorRespond: builder.mutation({
            query: ({ requestId, action }) => ({
                url: `/request/donor/respond/${requestId}`,
                method: "PUT",
                body: { action },
            }),
            invalidatesTags: ["Request", "DonorNotifications", "DonorMatches"],
        }),

        updateRequestStatus: builder.mutation({
            query: ({ id, action }) => ({
                url: `/request/donor/respond/${id}`,
                method: "PUT",
                body: { action }
            }),
            invalidatesTags: ["DonorMatches"],
        }),

        /* ------------------------------------------------------------------
            NOTIFICATIONS
        ------------------------------------------------------------------ */

        // Patient notifications
        getNotifications: builder.query({
            query: (userId) => `/notifications/${userId}`,
            providesTags: ["Notifications"],
        }),

        // CREATE NOTIFICATION (works for both patient & donor)
        createNotification: builder.mutation({
            query: (data) => ({
                url: `/notifications`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Notifications", "DonorNotifications"],
        }),

        // MARK SINGLE READ
        markAsRead: builder.mutation({
            query: (id) => ({
                url: `/notifications/read/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Notifications", "DonorNotifications"],
        }),

        // MARK ALL READ
        markAllAsRead: builder.mutation({
            query: (userId) => ({
                url: `/notifications/read-all/${userId}`,
                method: "PUT",
            }),
            invalidatesTags: ["Notifications", "DonorNotifications"],
        }),

        // DELETE
        deleteNotification: builder.mutation({
            query: (id) => ({
                url: `/notifications/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notifications", "DonorNotifications"],
        }),

        /* ------------------------------------------------------------------
            ADMIN
        ------------------------------------------------------------------ */
        loginAdmin: builder.mutation({
            query: (data) => ({
                url: "/admin/login",
                method: "POST",
                body: data,
            }),
        }),

        adminGetAllRequests: builder.query({
            query: () => "/admin/requests",
            providesTags: ["Request"],
        }),

        adminUpdateRequestStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/admin/requests/${id}`,
                method: "PUT",
                body: { status },
            }),
            invalidatesTags: ["Request"],
        }),

    }),
});

/* ------------------------------------------------------------------
   EXPORTED HOOKS
------------------------------------------------------------------ */
export const {
    // User Auth
    useRegisterUserMutation,
    useLoginUserMutation,
    useGetProfileQuery,
    useUpdateUserMutation,
    useActivateRoleMutation,

    // Patient Requests
    useCreateRequestMutation,
    useGetPatientRequestsQuery,
    useGetSingleRequestQuery,

    // Donor
    useRegisterDonorMutation,
    useLoginDonorMutation,
    useGetAllDonorsQuery,
    useGetDonorMatchesQuery,
    useDonorRespondMutation,
    useUpdateRequestStatusMutation,
    useUpdateAvailabilityMutation,

    // Notifications
    useGetNotificationsQuery,
    useGetDonorNotificationsQuery,
    useCreateNotificationMutation,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
    useDeleteNotificationMutation,

    // Admin
    useLoginAdminMutation,
    useAdminGetAllRequestsQuery,
    useAdminUpdateRequestStatusMutation,
} = bloodApi;