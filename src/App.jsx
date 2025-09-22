import React, { useEffect, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./contexts/AuthContext";

// Import skeleton loaders
import HomeSkeleton from "./Skeletons/HomeSkeleton";
import JobPortalsSkeleton from "./Skeletons/JobPortalsSkeleton";
import JobSearchSkeleton from "./Skeletons/JobSearchSkeleton";
import "./Skeletons/Skeleton.css";
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
const JobPortals = createLazyWithPreload(() =>
  import("./components/JobPortals/JobPortals")
);

const SearchJobGoogle = createLazyWithPreload(() =>
  import("./components/SearchJobGoogle/SearchJobGoogle")
);

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

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (isLoading) return <HomeSkeleton />;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  // Guest Only Route Component
  const GuestOnlyRoute = ({ children }) => {
    if (isLoading) return <HomeSkeleton />;
    return isAuthenticated ? <Navigate to="/" replace /> : children;
  };

  // Create preload handlers to pass to Navigation
  const preloadHandlers = {
    jobPortals: () => JobPortals.preload(),
    searchJobs: () => SearchJobGoogle.preload(),
  };

  // Show skeleton during auth loading
  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={<Home preloadHandlers={preloadHandlers} />} 
        />

        {/* Guest only routes */}
        <Route
          path="/login"
          element={
            <GuestOnlyRoute>
              <Login />
            </GuestOnlyRoute>
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

        {/* Public routes that work for both authenticated and unauthenticated users */}
        <Route
          path="/search-jobs"
          element={
            <Suspense fallback={<JobSearchSkeleton />}>
              <SearchJobGoogle />
            </Suspense>
          }
        />
        <Route
          path="/jobportals"
          element={
            <Suspense fallback={<JobPortalsSkeleton />}>
              <JobPortals />
            </Suspense>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
