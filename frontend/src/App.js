import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { LabInfoProvider } from "./context/LabInfoContext";
import { Toaster } from "./components/ui/sonner";
import CustomCursor from "./components/ui/CustomCursor";

function App() {
  return (
    <div className="App">
      <CustomCursor />
      <BrowserRouter>
        <AuthProvider>
          <LabInfoProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          </LabInfoProvider>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
