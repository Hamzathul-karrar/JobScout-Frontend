import React, { useEffect, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast"; 
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

// Critical components - Load immediately
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";

// Create lazy components with preload functionality
const createLazyWithPreload = (importFunc) => {
  const Component = React.lazy(importFunc);
  Component.preload = importFunc;
  return Component;
};

// Non-critical components - Load on demand/background
const JobPortals = createLazyWithPreload(() => import("./components/JobPortals/JobPortals"));
const SearchJobGoogle = createLazyWithPreload(() => import("./components/SearchJobGoogle/SearchJobGoogle"));

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Preload non-critical components after initial render
  useEffect(() => {
    const preloadTimer = setTimeout(() => {
      JobPortals.preload();
      SearchJobGoogle.preload();
    }, 100);

    return () => clearTimeout(preloadTimer);
  }, []);

  const GuestOnlyRoute = ({ children }) => {
    if (isLoading) return null;
    return isAuthenticated() ? <Navigate to="/" replace /> : children;
  };

  // Create preload handlers to pass to Navigation
  const preloadHandlers = {
    jobPortals: () => JobPortals.preload(),
    searchJobs: () => SearchJobGoogle.preload(),
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home preloadHandlers={preloadHandlers} />} />
        <Route 
          path="/jobportals" 
          element={
            <Suspense fallback={null}>
              <JobPortals />
            </Suspense>
          } 
        />
        <Route 
          path="/search-jobs" 
          element={
            <Suspense fallback={null}>
              <SearchJobGoogle />
            </Suspense>
          } 
        />
        <Route
          path="/register"
          element={
            <GuestOnlyRoute>
              <Register />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestOnlyRoute>
              <Login />
            </GuestOnlyRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 4000,
            style: {
              background: '#4caf50',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#f44336',
            },
          },
        }}
      />
    </>
  );
}

export default App;
