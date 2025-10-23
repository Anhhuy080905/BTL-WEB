import React from "react";
import "./LoadingSkeleton.css";

export const EventCardSkeleton = () => {
  return (
    <div className="event-card-skeleton">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text short"></div>
        <div className="skeleton-footer">
          <div className="skeleton skeleton-badge"></div>
          <div className="skeleton skeleton-badge"></div>
        </div>
      </div>
    </div>
  );
};

export const PostCardSkeleton = () => {
  return (
    <div className="post-card-skeleton">
      <div className="skeleton-header">
        <div className="skeleton skeleton-avatar"></div>
        <div className="skeleton-user-info">
          <div className="skeleton skeleton-name"></div>
          <div className="skeleton skeleton-time"></div>
        </div>
      </div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text short"></div>
    </div>
  );
};

export const LoadingSpinner = ({ size = "medium", color = "#4169e1" }) => {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner" style={{ borderTopColor: color }}></div>
    </div>
  );
};
