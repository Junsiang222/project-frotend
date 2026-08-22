import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import { CookiesProvider } from "react-cookie";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import CourtAdd from "./pages/CourtAdd";
import CourtEdit from "./pages/CourtEdit";
import Courts from "./pages/Courts";
import Dashboard from "./pages/Dashboard";
import DashboardAdd from "./pages/DashboardAdd";
import DashboardEdit from "./pages/DashboardEdit";
import ReviewPage from "./pages/ReviewPage";
import BookingTime from "./pages/BookingTime";
import BookingConfirm from "./pages/BookingConfirm";
import ProtectedRoute from "./components/ProtectedRoute";

import EditProfile from "./pages/EditProfile";
import ResetPassword from "./pages/ResetPassword";
import ManageCourts from "./pages/ManageCourts";
import ManageUsers from "./pages/ManageUsers";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import MyBookings from "./pages/MyBookings";
import AdminBookings from "./pages/AdminBookings";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CookiesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route
              path="/courts"
              element={
                <ProtectedRoute>
                  <Courts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/new"
              element={
                <ProtectedRoute>
                  <DashboardAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/review/:courtId"
              element={
                <ProtectedRoute>
                  <ReviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courts/new"
              element={
                <ProtectedRoute>
                  <CourtAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courts/:id/edit"
              element={
                <ProtectedRoute>
                  <CourtEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/:id/edit"
              element={
                <ProtectedRoute>
                  <DashboardEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/:courtId"
              element={
                <ProtectedRoute>
                  <BookingTime />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/:bookingId"
              element={
                <ProtectedRoute>
                  <BookingConfirm />
                </ProtectedRoute>
              }
            />

                // 在 Routes 里加：
              <Route
                path="/profile/edit"
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/reset-password"
                element={
                  <ProtectedRoute>
                    <ResetPassword />
                  </ProtectedRoute>
                }
              />
              <Route
             path="/courts/manage/:location"
             element={
            <ProtectedRoute>
            <ManageCourts />
           </ProtectedRoute>
           }
          />
          <Route
             path="/manage-users"
            element={
          <ProtectedRoute>
         <ManageUsers />
          </ProtectedRoute>
           }
          />
          <Route
              path="/payment/success"
              element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/cancel"
              element={
                <ProtectedRoute>
                  <PaymentCancel />
                </ProtectedRoute>
              }
            />
           <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
            path="/admin/bookings"
            element={<AdminBookings />}
            />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </CookiesProvider>
    </ThemeProvider>
  );
}

export default App;