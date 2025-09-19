import React from "react";
import { JobPortalsProvider } from "../../contexts/JobPortalsContext";
import Header from "./Header";
import FavoritePortalsSection from "./FavoritePortalsSection";
import AllPortalsSection from "./AllPortalsSection";
import "./JobPortals.css";

const JobPortals = () => {
  return (
    <JobPortalsProvider>
      <div className="job-portals">
        <Header />
        <div className="portals-container">
          <FavoritePortalsSection />
          <AllPortalsSection />
        </div>
      </div>
    </JobPortalsProvider>
  );
};

export default JobPortals;
