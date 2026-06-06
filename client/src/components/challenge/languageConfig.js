const LANGUAGE_DEFINITIONS = [
  {
    id: "javascript",
    label: "JavaScript",
    version: "Node.js",
    editorLanguage: "javascript",
    starter: "// write your solution here\n",
  },
  {
    id: "python",
    label: "Python",
    version: "3",
    editorLanguage: "python",
    starter: "# write your solution here\n",
  },
  {
    id: "java",
    label: "Java",
    version: "OpenJDK",
    editorLanguage: "java",
    starter: "// write your solution here\n",
  },
  {
    id: "cpp",
    label: "C++",
    version: "GCC",
    editorLanguage: "cpp",
    starter: "// write your solution here\n",
  },
];

export const LANGUAGE_OPTIONS = LANGUAGE_DEFINITIONS.map(
  ({ id, label, version }) => ({
    id,
    label,
    version,
  }),
);

export const LANGUAGE_MAP = LANGUAGE_DEFINITIONS.reduce(
  (map, language) => ({
    ...map,
    [language.id]: language.editorLanguage,
  }),
  {},
);

export const DEFAULT_CODE = LANGUAGE_DEFINITIONS.reduce(
  (map, language) => ({
    ...map,
    [language.id]: language.starter,
  }),
  {},
);

export const getStarterCode = (starterCode = {}) => ({
  javascript:
    starterCode.javascript || starterCode.js || DEFAULT_CODE.javascript,
  python: starterCode.python || starterCode.py || DEFAULT_CODE.python,
  java: starterCode.java || DEFAULT_CODE.java,
  cpp:
    starterCode.cpp ||
    starterCode["c++"] ||
    starterCode.cpp17 ||
    DEFAULT_CODE.cpp,
});
