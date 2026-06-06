import { motion } from "framer-motion";
import { Code2, Sparkles } from "lucide-react";

const AuthLayout = ({ eyebrow, title, subtitle, children }) => {
  return (
    <main className="auth-shell">
      <div className="auth-ambient" />

      <nav className="auth-nav">
        <div className="brand-mark">
          <Code2 size={20} />
        </div>
        <span className="brand-text">InterVueX</span>
      </nav>

      <section className="auth-grid">
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="auth-copy"
        >
          <div className="auth-pill">
            <Sparkles size={14} />
            AI interview workspace
          </div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </motion.aside>

        <motion.section
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="auth-card"
        >
          <p className="auth-eyebrow">{eyebrow}</p>
          {children}
        </motion.section>
      </section>
    </main>
  );
};

export default AuthLayout;

