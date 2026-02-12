import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Files from "./pages/Files";
import FileDetails from "./pages/FileDetails";
import Accounts from "./pages/Accounts";
import PaymentRegister from "./pages/accounts/PaymentRegister";
import MonthlyAbstract from "./pages/accounts/MonthlyAbstract";
import Reports from "./pages/Reports";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import UnitAdmin from "./pages/UnitAdmin";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* DASHBOARD */}
        <Route index element={<Dashboard />} />
        <Route path="/unit-admin" element={<UnitAdmin />} />

        {/* FILES */}
        <Route path="files" element={<Files />} />
        <Route path="files/:id" element={<FileDetails />} />

        {/* ACCOUNTS */}
        <Route path="accounts">
          <Route index element={<Accounts />} />
          <Route
            path="payment-register"
            element={<PaymentRegister />}
          />
          <Route
            path="monthly-abstract"
            element={<MonthlyAbstract />}
          />
        </Route>

        {/* REPORTS */}
        <Route path="reports" element={<Reports />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
