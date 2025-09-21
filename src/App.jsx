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
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
      <Routes>
        <Route
          path="/"
          element={<Home preloadHandlers={preloadHandlers} />}
        />
        <Route
          path="/jobportals"
          element={
            isAuthenticated ? (
              <Suspense fallback={<JobPortalsSkeleton />}>
                <JobPortals />
              </Suspense>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/search-jobs"
          element={
            isAuthenticated ? (
              <Suspense fallback={<JobSearchSkeleton />}>
                <SearchJobGoogle />
              </Suspense>
            ) : (
              <Navigate to="/login" replace />
            )
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
      </Routes>
    </>
  );
}

export default App;
