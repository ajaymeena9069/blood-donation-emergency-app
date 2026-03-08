import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./component/layout/MainLayout";
import DonorDashboard from "./component/donor/DonorDashboard";
import AdminDashboard from "./component/admin/AdminDashboard";
import PatientDashboard from "./component/patient/PatientDashboard";
import BloodRequestForm from "./pages/BloodRequestForm";
import ProtectedRoute from "./component/ProtectedRoute";
import Home from "./pages/Home";
import FindDonors from "./pages/FindDonors";
import { Services } from "./pages/Services";
import Contact from "./pages/Contact";
import BloodCare from "./pages/BloodCamps";
import PatientRequests from "./component/common/PatientRequests";
import SinglePatientRequest from "./component/ui/SinglePatientRequest";
import DonorMatchingRequests from "./component/ui/DonorMatchingRequests";
import UserRegistration from "./pages/UserRegistration";
import UserLogin from "./pages/UserLogin";
import UserProfile from "./pages/UserProfile";
import UserDashboard from "./pages/UserDashboard";
import NotificationsPage from "./component/common/Notification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PageNotFound from "./pages/PageNotFound";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // PUBLIC ROUTES
      { path: "/", element: <Home /> },
      { path: "find-donors", element: <FindDonors /> },
      { path: "donors", element: <FindDonors /> },
      { path: "services", element: <Services /> },
      { path: "contact", element: <Contact /> },
      { path: "care", element: <BloodCare /> },

      // AUTH ROUTES
      { path: "register", element: <UserRegistration /> },
      { path: "login", element: <UserLogin /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },

      // PROFILE ROUTES
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        )
      },
      {
        path: "donor/profile",
        element: (
          <ProtectedRoute role="donor">
            <UserProfile />
          </ProtectedRoute>
        )
      },
      {
        path: "patient/profile",
        element: (
          <ProtectedRoute role="patient">
            <UserProfile />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/profile",
        element: (
          <ProtectedRoute role="admin">
            <UserProfile />
          </ProtectedRoute>
        )
      },

      // DASHBOARD ROUTES
      {
        path: "user/dashboard",
        element: (
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "donor/dashboard",
        element: (
          <ProtectedRoute role="donor">
            <DonorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/dashboard",
        element: (
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient/dashboard",
        element: (
          <ProtectedRoute role="patient">
            <PatientDashboard />
          </ProtectedRoute>
        ),
      },

      // PATIENT ROUTES
      {
        path: "patient/create/request",
        element: (
          <ProtectedRoute role="patient">
            <BloodRequestForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient/request-details/:id",
        element: (
          <ProtectedRoute role="patient">
            <SinglePatientRequest />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient/requests/:status",
        element: (
          <ProtectedRoute role="patient">
            <PatientRequests />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient/completed/requests/:id",
        element: (
          <ProtectedRoute role="patient">
            <SinglePatientRequest />
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute roles={["patient", "donor", "admin"]}>
            <NotificationsPage />
          </ProtectedRoute>
        ),
      },

      // DONOR ROUTES
      // {
      //   path: "donor/notifications",
      //   element: (
      //     <ProtectedRoute role="donor">
      //       <DonorNotifications />
      //     </ProtectedRoute>
      //   ),
      // },
      {
        path: "donor/matches",
        element: (
          <ProtectedRoute role="donor">
            <DonorMatchingRequests />
          </ProtectedRoute>
        ),
      },
      {
        path: "donor/matching-requests/:id",
        element: (
          <ProtectedRoute role="donor">
            <SinglePatientRequest />
          </ProtectedRoute>
        ),
      },

      // ADMIN ROUTES (Add if you have admin components)
      // {
      //   path: "admin/users",
      //   element: (
      //     <ProtectedRoute role="admin">
      //       <AdminUsers />
      //     </ProtectedRoute>
      //   ),
      // },

      // CATCH-ALL ROUTE (404)
      { path: "*", element: <PageNotFound /> },
    ],
  },
]);

export default routes;