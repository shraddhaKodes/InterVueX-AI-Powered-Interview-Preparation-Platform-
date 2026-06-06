import { AlertCircle } from "lucide-react";

const AuthInput = ({
  icon: Icon,
  label,
  error,
  rightElement,
  className = "",
  ...props
}) => {
  return (
    <label className="auth-field">
      <span>{label}</span>
      <div className={`auth-input-wrap ${error ? "auth-input-error" : ""}`}>
        {Icon && <Icon className="auth-input-icon" size={18} />}
        <input className={`auth-input ${className}`} {...props} />
        {rightElement}
      </div>
      {error && (
        <small className="auth-error">
          <AlertCircle size={14} />
          {error}
        </small>
      )}
    </label>
  );
};

export default AuthInput;

