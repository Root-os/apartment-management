import React, { Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import './index.css';
import App from "./App";
import store from "./app/store";
import SuspenseContent from "./containers/SuspenseContent";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { registerLogout } from "./utils/api";

const AuthBridge = () => {
  const { logout } = useAuth();

  useEffect(() => {
    registerLogout(logout);
  }, [logout]);

  return null;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Suspense fallback={<SuspenseContent />}>
    <Provider store={store}>
      <BrowserRouter> 
        <AuthProvider>
          <AuthBridge />
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </Suspense>
);
