import React from "react";

const LoadingSkeletonBlock = ({ lines = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, idx) => (
        <div key={idx} className="h-4 rounded bg-slate-900/80 animate-pulse" />
      ))}
    </div>
  );
};

export default LoadingSkeletonBlock;
