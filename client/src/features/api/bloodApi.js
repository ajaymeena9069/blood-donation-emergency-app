/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bloodApi = createApi({
    reducerPath: "bloodApi",

    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000/api",
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            let token = localStorage.getItem("token");

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
        "DonorMatches",
        "Donors",
        "Donor",
        "Profile",
        "User",
    ],

    endpoints: (builder) => ({
        /* -------------------- AUTH -------------------- */

        registerUser: builder.mutation({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body: data,
            }),
        }),

        loginUser: builder.mutation({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data,
            }),
        }),

        getProfile: builder.query({
            query: () => "/user/profile",
            providesTags: ["Profile", "User"],
        }),

        updateUser: builder.mutation({
            query: (data) => ({
                url: "/user/profile",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Profile", "User"],
        }),

        // SIMPLE ROLE ACTIVATION
        activateRole: builder.mutation({
            query: (roleToActivate) => ({
                url: "/user/activate-role",
                method: "POST",
                body: { roleToActivate },
            }),
            invalidatesTags: ["Profile", "User"],
            async onQueryStarted(roleToActivate, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data?.data?.token) {
                        localStorage.setItem("token", data.data.token);
                    }
                    // Refresh user data
                    dispatch(bloodApi.util.invalidateTags(['User', 'Profile']));
                } catch (err) {
                    console.error("Role activation failed", err);
                }
            },
        }),

        /* -------------------- PATIENT REQUESTS -------------------- */

        createRequest: builder.mutation({
            query: (data) => ({
                url: "/request/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Request"],
        }),

        getPatientRequests: builder.query({
            query: (patientID) => `/request/patient/${patientID}/requests`,
            providesTags: ["Request"],
        }),

        getSingleRequest: builder.query({
            query: (id) => `/request/single/${id}`,
            providesTags: ["Request"],
        }),

        deleteRequest: builder.mutation({
            query: (id) => ({
                url: `/request/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Request', 'DonorMatches']
        }),

        updateRequest: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `request/${id}`, // YEH CHECK KARO
                method: 'PUT',
                body: data
            })
        }),

        /* -------------------- DONORS -------------------- */

        getAllDonors: builder.query({
            query: () => "/donor/all",
            providesTags: ["Donors"],
        }),

        updateAvailability: builder.mutation({
            query: ({ id, available }) => ({
                url: `/donor/availability/${id}`,
                method: "PUT",
                body: { available },
            }),
            invalidatesTags: ["Donor"],
        }),

        acceptRequest: builder.mutation({
            query: (id) => ({
                url: `/request/${id}/accept`,
                method: "POST",
            }),
            invalidatesTags: ["Request"],
        }),

        cancelRequest: builder.mutation({
            query: ({ id, reason }) => ({
                url: `/request/${id}/cancel`,
                method: "POST",
                body: { reason },
            }),
            invalidatesTags: ["Request"],
        }),

        /* -------------------- DONOR MATCHES -------------------- */

        getDonorMatches: builder.query({
            query: () => "/request/donor/matches",
            providesTags: ["DonorMatches", "Request"],
        }),

        donorRespond: builder.mutation({
            query: ({ requestId, action }) => ({
                url: `/request/donor/respond/${requestId}`,
                method: "PUT",
                body: { action },
            }),
            invalidatesTags: ["Request", "DonorMatches"],
        }),

        /* -------------------- ADMIN -------------------- */

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

        //GET MY NOTIFICATIONS
        // bloodApi.js - Correct the endpoints:

        getMyNotifications: builder.query({
            query: (role) => `/notifications?role=${role}`,
            providesTags: (result, error, role) =>
                result?.data
                    ? [
                        ...result.data.map((n) => ({
                            type: "Notification",
                            id: n._id,
                        })),
                        { type: "Notification", id: `LIST-${role}` },
                    ]
                    : [{ type: "Notification", id: `LIST-${role}` }],
        }),

        getUnreadNotificationCount: builder.query({
            query: (role) => `/notifications/unread-count?role=${role}`,
            providesTags: [{ type: "Notification", id: "UNREAD_COUNT" }],
        }),

        markNotificationAsRead: builder.mutation({
            query: ({ notificationId }) => ({
                url: `/notifications/${notificationId}/read`,
                method: "PATCH",
            }),
            invalidatesTags: (result, error, { notificationId }) => [
                { type: "Notification", id: notificationId },
                { type: "Notification", id: "UNREAD_COUNT" },
            ],
        }),

        markAllNotificationsAsRead: builder.mutation({
            query: (role) => ({
                url: `/notifications/read-all?role=${role}`,
                method: "PATCH",
            }),
            invalidatesTags: [
                { type: "Notification", id: "LIST" },
                { type: "Notification", id: "UNREAD_COUNT" },
            ],
        }),

        deleteNotification: builder.mutation({
            query: ({ notificationId }) => ({
                url: `/notifications/${notificationId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { notificationId }) => [
                { type: "Notification", id: notificationId },
                { type: "Notification", id: "LIST" },
                { type: "Notification", id: "UNREAD_COUNT" },
            ],
        }),
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useGetProfileQuery,
    useUpdateUserMutation,
    useActivateRoleMutation,

    useCreateRequestMutation,
    useGetPatientRequestsQuery,
    useGetSingleRequestQuery,
    useAcceptRequestMutation,
    useCancelRequestMutation,
    useDeleteRequestMutation,
    useUpdateRequestMutation,

    useGetAllDonorsQuery,
    useUpdateAvailabilityMutation,

    useGetDonorMatchesQuery,
    useDonorRespondMutation,

    useGetMyNotificationsQuery,
    useGetUnreadNotificationCountQuery,
    useMarkNotificationAsReadMutation,
    useMarkAllNotificationsAsReadMutation,
    useDeleteNotificationMutation,

    useLoginAdminMutation,
    useAdminGetAllRequestsQuery,
    useAdminUpdateRequestStatusMutation,
} = bloodApi;