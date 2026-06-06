import { useState, useEffect, useContext } from "react";
import { useProblemAdminStore } from "../../../store/problemAdminStore.js";
import { ThemeContext } from "../../../context/ThemeContext.jsx";

const empty = () => ({
  title: "",
  slug: "",
  difficulty: "easy",
  description: "",
  examples: [],
  constraints: [],
  starterCode: { javascript: "", python: "", java: "", cpp: "" },
  visibleTestCases: [],
  hiddenTestCases: [],
});

const ProblemForm = ({ problem, onDone }) => {
  const isEdit = Boolean(problem);
  const [form, setForm] = useState(empty());
  const { createProblem, updateProblem, fetchProblems, loading } =
    useProblemAdminStore();

  useEffect(() => {
    if (problem) {
      setForm({
        title: problem.title || "",
        slug: problem.slug || "",
        difficulty: problem.difficulty || "easy",
        description: problem.description || "",
        examples: problem.examples || [],
        constraints: problem.constraints || [],
        starterCode: Object.assign(
          { javascript: "", python: "", java: "", cpp: "" },
          problem.starterCode || {},
        ),
        visibleTestCases: problem.visibleTestCases || [],
        hiddenTestCases: problem.hiddenTestCases || [],
      });
    } else {
      setForm(empty());
    }
  }, [problem]);

  const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateProblem(problem._id, form);
      } else {
        await createProblem(form);
      }
      fetchProblems();
      onDone && onDone();
    } catch (err) {}
  };

  const addRow = (key) => {
    setForm((s) => ({ ...s, [key]: [...(s[key] || []), ""] }));
  };

  const updateRow = (key, idx, val) => {
    setForm((s) => ({
      ...s,
      [key]: s[key].map((r, i) => (i === idx ? val : r)),
    }));
  };

  const removeRow = (key, idx) => {
    setForm((s) => ({ ...s, [key]: s[key].filter((_, i) => i !== idx) }));
  };

  const addTestCase = (key) => {
    setForm((s) => ({
      ...s,
      [key]: [...(s[key] || []), { input: "", output: "" }],
    }));
  };

  const updateTestCase = (key, idx, field, val) => {
    setForm((s) => ({
      ...s,
      [key]: s[key].map((r, i) => (i === idx ? { ...r, [field]: val } : r)),
    }));
  };

  const removeTestCase = (key, idx) => {
    setForm((s) => ({ ...s, [key]: s[key].filter((_, i) => i !== idx) }));
  };

  const { darkMode } = useContext(ThemeContext);

  const panelClass = darkMode
    ? "dashboard-panel bg-slate-950/80 text-slate-100"
    : "dashboard-panel bg-white/95 text-slate-900";

  return (
    <form onSubmit={submit} className={`space-y-4 ${panelClass}`}>
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          value={form.title}
          onChange={(e) => setField("title", e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2 bg-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Slug</label>
        <input
          value={form.slug}
          onChange={(e) => setField("slug", e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2 bg-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Difficulty</label>
        <select
          value={form.difficulty}
          onChange={(e) => setField("difficulty", e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2 bg-transparent"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">
          Description (HTML/Markdown)
        </label>
        <textarea
          rows={6}
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2 bg-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Examples</label>
        {(form.examples || []).map((ex, i) => (
          <div key={i} className="flex gap-2 mt-2">
            <input
              value={ex}
              onChange={(e) => updateRow("examples", i, e.target.value)}
              className="flex-1 rounded-md border px-3 py-2"
            />
            <button
              type="button"
              onClick={() => removeRow("examples", i)}
              className="btn-secondary"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addRow("examples")}
          className="mt-2 btn-primary"
        >
          Add Example
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium">Constraints</label>
        {(form.constraints || []).map((ex, i) => (
          <div key={i} className="flex gap-2 mt-2">
            <input
              value={ex}
              onChange={(e) => updateRow("constraints", i, e.target.value)}
              className="flex-1 rounded-md border px-3 py-2"
            />
            <button
              type="button"
              onClick={() => removeRow("constraints", i)}
              className="btn-secondary"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addRow("constraints")}
          className="mt-2 btn-primary"
        >
          Add Constraint
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium">Starter Code</label>
        {Object.keys(form.starterCode).map((lang) => (
          <div key={lang} className="mt-2">
            <div className="text-xs font-medium">{lang}</div>
            <textarea
              rows={3}
              value={form.starterCode[lang] || ""}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  starterCode: { ...s.starterCode, [lang]: e.target.value },
                }))
              }
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium">Visible Test Cases</label>
        {(form.visibleTestCases || []).map((tc, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 mt-2">
            <input
              value={tc.input}
              placeholder="Input"
              onChange={(e) =>
                updateTestCase("visibleTestCases", i, "input", e.target.value)
              }
              className="rounded-md border px-3 py-2"
            />
            <input
              value={tc.output}
              placeholder="Output"
              onChange={(e) =>
                updateTestCase("visibleTestCases", i, "output", e.target.value)
              }
              className="rounded-md border px-3 py-2"
            />
            <div className="col-span-2 flex justify-end">
              <button
                type="button"
                onClick={() => removeTestCase("visibleTestCases", i)}
                className="btn-secondary"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addTestCase("visibleTestCases")}
          className="mt-2 btn-primary"
        >
          Add Visible Test Case
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium">Hidden Test Cases</label>
        {(form.hiddenTestCases || []).map((tc, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 mt-2">
            <input
              value={tc.input}
              placeholder="Input"
              onChange={(e) =>
                updateTestCase("hiddenTestCases", i, "input", e.target.value)
              }
              className="rounded-md border px-3 py-2"
            />
            <input
              value={tc.output}
              placeholder="Output"
              onChange={(e) =>
                updateTestCase("hiddenTestCases", i, "output", e.target.value)
              }
              className="rounded-md border px-3 py-2"
            />
            <div className="col-span-2 flex justify-end">
              <button
                type="button"
                onClick={() => removeTestCase("hiddenTestCases", i)}
                className="btn-secondary"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addTestCase("hiddenTestCases")}
          className="mt-2 btn-primary"
        >
          Add Hidden Test Case
        </button>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {isEdit ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={() => {
            setForm(empty());
            onDone && onDone();
          }}
          className="btn-secondary"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default ProblemForm;
