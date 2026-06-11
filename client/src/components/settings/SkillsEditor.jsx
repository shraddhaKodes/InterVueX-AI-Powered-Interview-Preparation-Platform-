import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext.jsx";

const SkillsEditor = ({ value, onChange, error }) => {
  const theme = useContext(ThemeContext);

  const textValue = Array.isArray(value) ? value.join(", ") : value || "";

  const handleChange = (e) => {
    onChange(e.target.value); // store raw string
  };

  const handleBlur = (e) => {
    const parsed = e.target.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20);

    onChange(parsed); // convert to array only when user leaves input
  };

  return (
    <div>
      <input
        className="w-full rounded-xl border px-4 py-3"
        value={textValue}
        placeholder="e.g. React, Node.js, TypeScript"
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {error ? <p className="mt-2 text-xs text-rose-400">{error}</p> : null}
    </div>
  );
};
export default SkillsEditor;
