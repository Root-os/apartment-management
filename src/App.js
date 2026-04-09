import React, { lazy, useEffect, useState } from "react";
import "./App.css";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { themeChange } from "theme-change";
import checkAuth from "./app/auth";
import initializeApp from "./app/init";
import LoadingComponent from "../src/components/loading";
import { CalendarProvider } from "./context/calendarContext";



const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const PaymnetRequestLink = lazy(() => import("./pages/PaymentRequestLink"));

const TenantLogin = lazy(() => import("./pages/TenantLogin"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Register = lazy(() => import("./pages/Register"));
const TestDatePickerPage = lazy(() => import("./components/Common/datePicker"));


initializeApp();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    themeChange(false);

    const token = checkAuth();
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  //   useEffect(() => {
  //   themeChange(false);
  //   setIsAuthenticated(!!localStorage.getItem("token")); // presence only
  // }, []);

  if (loading) {
    return <LoadingComponent />;
  }
  const role = localStorage.getItem("role");

  return (
    <CalendarProvider>
        <Routes>
          {/* Public routes */}
          {/* <Route path="/" element={<Choice />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/tenant-login" element={<TenantLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tenant/r/:token" element={<PaymnetRequestLink />} />
          {/* Test route for SmartDateInput */}
          <Route path="/test-date-picker" element={<TestDatePickerPage />} />


          {/* Protected route */}
          <Route
            path="/app/*"
            element={
              isAuthenticated ? (
                <Layout />
              ) : role ? (
                role === "tenant" ? (
                  <Navigate to="/tenant-login" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              ) : (
                <Navigate to="/login" replace />
                // <Choice />
              )
            }
          />

          {/* Catch-all route */}
          // <Route
          //   path="*"
          //   element={
          //     role ? (
          //       role === "tenant" ? (
          //         <Navigate to="/tenant-login" replace />
          //       ) : (
          //         <Navigate to="/login" replace />
          //       )
          //     ) : (
          //       <Navigate to="/login" replace />
          //       // <Choice />
          //     )
          //   }
          // />
        </Routes>
    </CalendarProvider>
  );
}

export default App;
