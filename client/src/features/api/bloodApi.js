import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bloodApi = createApi({
    reducerPath: "bloodApi",

    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000/api",
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) headers.set("authorization", `Bearer ${token}`);
            return headers;
        },
    }),

    tagTypes: ["Request", "Notifications", "DonorNotifications", "DonorMatches", "Donor"],

    endpoints: (builder) => ({

        /* ------------------------------------------------------------------
            PATIENT AUTH
        ------------------------------------------------------------------ */
        registerPatient: builder.mutation({
            query: (data) => ({
                url: "/patient/register",
                method: "POST",
                body: data,
            }),
        }),

        loginPatient: builder.mutation({
            query: (data) => ({
                url: "/patient/login",
                method: "POST",
                body: data,
            }),
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
            NOTIFICATIONS (NEW UPDATED)
        ------------------------------------------------------------------ */

        // Patient notifications
        getNotifications: builder.query({
            query: (userId) => `/notifications/${userId}`,
            providesTags: ["Notifications"],
        }),

        // Donor notifications
        getDonorNotifications: builder.query({
            query: (donorId) => `/notifications/donor/${donorId}`,
            providesTags: ["DonorNotifications"],
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
    // Patient
    useRegisterPatientMutation,
    useLoginPatientMutation,
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

    // Notifications
    useGetNotificationsQuery,
    useGetDonorNotificationsQuery,
    useCreateNotificationMutation,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
    useDeleteNotificationMutation,
    useUpdateAvailabilityMutation,
    // Admin
    useLoginAdminMutation,
    useAdminGetAllRequestsQuery,
    useAdminUpdateRequestStatusMutation,
} = bloodApi;
