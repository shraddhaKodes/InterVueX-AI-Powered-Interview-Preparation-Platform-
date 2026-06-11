import React from "react";

const ErrorBanner = ({ message }) => {
  if (!message) return null;

  return (
    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3">
      <p className="text-sm text-rose-200">{message}</p>
    </div>
  );
};

export default ErrorBanner;
