import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./component/layout/MainLayout";
import DonorDashboard from "./pages/DonorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BloodRequestForm from "./pages/BloodRequestForm";
import ProtectedRoute from "./component/ProtectedRoute";
import Home from "./pages/Home";
import FindDonors from "./pages/FindDonors";
import { Services } from "./pages/Services";
import Contact from "./pages/Contact";
import BloodCamps from "./pages/BloodCamps";
import PatientDashboard from "./pages/PatientDashboard";
import PatientRequests from "./component/Common/PatientRequests";
import SinglePatientRequest from "./component/ui/SinglePatientRequest";
import AllNotifications from "./component/ui/AllNotifications";
import DonorNotifications from "./component/ui/DonorNotifications";
import DonorMatchingRequests from "./component/ui/DonorMatchingRequests";
import UserRegistration from "./pages/UserRegistration";
import UserLogin from "./pages/UserLogin";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },

      // SIMPLE ROUTES
      { path: "donors", element: <FindDonors /> },
      { path: "services", element: <Services /> },
      { path: "contact", element: <Contact /> },
      { path: "camps", element: <BloodCamps /> },

      // REGISTER ROUTES
      {
        path: "register",
        element: <UserRegistration />
      },
      {
        path: "login",
        element: <UserLogin />
      },
      // DASHBOARDS
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

      // PATIENT REQUEST ROUTES
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
        path: "patient/notifications",
        element: (
          <ProtectedRoute role="patient">
            <AllNotifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "donor/notifications",
        element: (
          <ProtectedRoute role="donor">
            <DonorNotifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "/donor/matching-requests",
        element: (
          <ProtectedRoute role="donor">
            <DonorMatchingRequests />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default routes;
