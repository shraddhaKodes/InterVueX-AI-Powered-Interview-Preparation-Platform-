import React from "react";

const SettingsSection = ({ title, subtitle, icon, children, right }) => {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
            {title}
          </p>
          {subtitle ? (
            <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
};

export default SettingsSection;
