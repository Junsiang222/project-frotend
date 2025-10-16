import { BrowserRouter, Routes, Route } from "react-router"; 
import { Toaster } from "sonner";
import { CookiesProvider } from "react-cookie";

import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import CourtAdd from "./pages/CourtAdd";
import CourtEdit from "./pages/CourtEdit";
import Courts from "./pages/Courts";
import Dashboard from"./pages/Dashboard";
import DashboardAdd from"./pages/DashboardAdd";
import DashboardEdit from"./pages/DashboardEdit";
import ReviewPage from"./pages/ReviewPage";
import BookingTime from"./pages/BookingTime";
import BookingConfirm from"./pages/BookingConfirm";

function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Courts />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/new" element={<DashboardAdd />} />
          <Route path="/review/:courtId" element={<ReviewPage />} />
          <Route path="/courts/new" element={<CourtAdd />} />
          <Route path="/courts/:id/edit" element={<CourtEdit />} />
          <Route path="/dashboard/:id/edit" element={<DashboardEdit />} />
          <Route path="/booking/:courtId" element={<BookingTime />} />
          <Route path="/bookings/:bookingId" element={<BookingConfirm />} />


        </Routes>
        <Toaster />
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
