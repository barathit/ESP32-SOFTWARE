import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import CommandoDashboard from "./pages/CommandoDashboard";
import PreRescueForm from "./pages/PreRescueForm";
import LiveMonitoring from "./pages/LiveMonitoring";
import PostRescueForm from "./pages/PostRescueForm";
import AdminDashboard from "./pages/AdminDashboard";
import EditCommando from "./pages/EditCommando";
import MapDevice from "./pages/MapDevice";

const AppRoutes = () => {
  const { isAuthenticated, isAdmin, isCommando } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            {isAdmin ? <AdminDashboard /> : <CommandoDashboard />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/pre-rescue"
        element={
          <ProtectedRoute>
            <PreRescueForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor/:operationId"
        element={
          <ProtectedRoute>
            <LiveMonitoring />
          </ProtectedRoute>
        }
      />
      <Route
        path="/post-rescue/:operationId"
        element={
          <ProtectedRoute>
            <PostRescueForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/edit-commando/:id"
        element={
          <ProtectedRoute adminOnly>
            <EditCommando />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/map-device"
        element={
          <ProtectedRoute adminOnly>
            <MapDevice />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
