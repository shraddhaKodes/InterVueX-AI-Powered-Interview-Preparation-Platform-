import React from "react";
import {ThemeContext} from "../../context/ThemeContext.jsx";
const FormField = ({ label, hint, error, children, required }) => {
  return (
    <label className="block">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{label}</span>
          {required ? (
            <span className="text-xs text-slate-400">(required)</span>
          ) : null}
        </div>
        {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
      </div>

      <div className="mt-2">{children}</div>

      {error ? <p className="mt-2 text-xs text-rose-400">{error}</p> : null}
    </label>
  );
};

export default FormField;
