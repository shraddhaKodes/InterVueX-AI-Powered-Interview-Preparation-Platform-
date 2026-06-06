import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const QuestionNavigator = ({
  questions = [],
  answers = [],
  currentIndex,
  onSelect,
}) => {
  const { darkMode } = useContext(ThemeContext);

  const answeredIndexes = new Set(
    answers.map((answer) => answer.questionIndex)
  );

  return (
    <div className="grid grid-cols-5 gap-2 sm:flex sm:flex-wrap sm:items-center">
      {questions.map((question, index) => {
        const isActive = index === currentIndex;
        const isAnswered = answeredIndexes.has(index);

        const buttonClass = isActive
          ? darkMode
            ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
            : "border-cyan-500 bg-cyan-100 text-cyan-700"
          : isAnswered
            ? darkMode
              ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
              : "border-emerald-300 bg-emerald-100 text-emerald-700"
            : darkMode
              ? "border-white/10 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100";

        return (
          <button
            key={`${question.question}-${index}`}
            type="button"
            onClick={() => onSelect(index)}
            className={`grid h-11 w-11 place-items-center rounded-2xl border text-sm font-semibold transition-all duration-300 ${buttonClass}`}
            aria-label={`Go to question ${index + 1}`}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
};

export default QuestionNavigator;