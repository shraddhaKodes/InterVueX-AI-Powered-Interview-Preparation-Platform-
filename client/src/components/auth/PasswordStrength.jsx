const getPasswordScore = (password) => {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  return score;
};

const strengthLabels = ["Weak", "Weak", "Fair", "Good", "Strong"];

const PasswordStrength = ({ password }) => {
  const score = getPasswordScore(password);

  return (
    <div className="strength-wrap">
      <div className="strength-bars">
        {[1, 2, 3, 4].map((level) => (
          <span
            key={level}
            className={level <= score ? "strength-bar-active" : ""}
          />
        ))}
      </div>
      <small>{password ? strengthLabels[score] : "Use 8+ characters"}</small>
    </div>
  );
};

export default PasswordStrength;

