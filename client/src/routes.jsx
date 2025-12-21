import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./component/layout/MainLayout";
import DonorRegister from "./pages/DonorRegister";
import DonorLogin from "./pages/DonorLogin";
import PatientRegister from "./pages/PatientRegister";
import PatientLogin from "./pages/PatientLogin";
import AdminLogin from "./pages/AdminLogin";
import DonorDashboard from "./pages/DonorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BloodRequestForm from "./pages/BloodRequestForm";
import ProtectedRoute from "./component/ProtectedRoute";
import Home from "./pages/Home";
import FindDonors from "./pages/FindDonors";
import { Services } from "./pages/Services";
import Contact from "./pages/Contact";
import BloodCamps from "./pages/BloodCamps";
import RegisterationPage from "./pages/RegisterationPage";
import LoginOptions from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import PatientRequests from "./component/Common/PatientRequests";
import SinglePatientRequest from "./component/ui/SinglePatientRequest";
import CompletedRequests from "./component/ui/CompletedRequests";
import AllNotifications from "./component/ui/AllNotifications";
import DonorNotifications from "./component/ui/DonorNotifications";
import DonorMatchingRequests from "./component/ui/DonorMatchingRequests";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },

      // LOGIN ROUTES
      { path: "login/donor", element: <DonorLogin /> },
      { path: "login/patient", element: <PatientLogin /> },
      { path: "login/admin", element: <AdminLogin /> },
      { path: "login", element: <LoginOptions /> },

      // SIMPLE ROUTES
      { path: "donors", element: <FindDonors /> },
      { path: "services", element: <Services /> },
      { path: "contact", element: <Contact /> },
      { path: "camps", element: <BloodCamps /> },

      // REGISTER ROUTES
      {
        path: "register",
        element: <RegisterationPage />,
        children: [
          { path: "donor", element: <DonorRegister /> },
          { path: "patient", element: <PatientRegister /> },
        ],
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
