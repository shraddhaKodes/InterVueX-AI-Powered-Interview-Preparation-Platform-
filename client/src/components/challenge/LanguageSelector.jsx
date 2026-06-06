import { LANGUAGE_OPTIONS } from "./languageConfig";

const LanguageSelector = ({ language, languages = LANGUAGE_OPTIONS, onSelect }) => {
  const selectedLanguage =
    languages.find((option) => option.id === language) || languages[0];

  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
      <span>Language</span>
      <select
        value={language}
        onChange={(event) => onSelect(event.target.value)}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-white/10 dark:bg-slate-950 dark:text-white"
      >
        {languages.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
            {option.version ? ` (${option.version})` : ""}
          </option>
        ))}
      </select>
      <span className="sr-only">{selectedLanguage.label}</span>
    </label>
  );
};
export default LanguageSelector;
