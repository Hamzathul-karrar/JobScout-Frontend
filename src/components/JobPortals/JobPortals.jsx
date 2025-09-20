import React from "react";
import { JobPortalsProvider } from "../../contexts/JobPortalsContext";
import Navigation from "../Navigation/Navigation";
import FavoritePortalsSection from "./FavoritePortalsSection";
import AllPortalsSection from "./AllPortalsSection";
import "./JobPortals.css";

const JobPortals = () => {
  return (
    <JobPortalsProvider>
      <div className="job-portals">
        <Navigation />
        <div className="portals-container">
          <FavoritePortalsSection />
          <AllPortalsSection />
        </div>
      </div>
    </JobPortalsProvider>
  );
};

export default JobPortals;
