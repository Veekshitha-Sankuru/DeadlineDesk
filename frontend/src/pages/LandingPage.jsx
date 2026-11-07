import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Smartphone,
  BarChart3,
  ArrowRight,
  Github,
} from "lucide-react";

/**
 * LandingPage — Public-facing marketing page at route "/".
 * Sections: Navbar → Hero → Stats → Features → How It Works → CTA → Footer
 */
const LandingPage = () => {
  return (
    <div className="landing">

      {/* ── Navbar ───────────────────────────────────────── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">
            <div className="landing-logo-icon">
              <BookOpen size={20} />
            </div>
            <span className="landing-logo-text">DeadlineDesk</span>
          </div>
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#stats">Stats</a>
          </div>
          <Link to="/dashboard" className="btn btn-primary landing-cta-btn">
            Open App <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="landing-hero-badge">
          🎓 Built for college students
        </div>
        <h1 className="landing-hero-title">
          Never miss a deadline<br />
          <span className="landing-hero-gradient">again.</span>
        </h1>
        <p className="landing-hero-subtitle">
          DeadlineDesk is your all-in-one assignment tracker. Add assignments,
          track due dates, and stay on top of every subject — all in one clean dashboard.
        </p>
        <div className="landing-hero-actions">
          <Link to="/dashboard" className="btn btn-primary landing-hero-btn">
            Get Started Free <ArrowRight size={15} />
          </Link>
          <a href="#how-it-works" className="btn btn-secondary landing-hero-btn">
            See how it works
          </a>
        </div>

        {/* Hero visual — mock dashboard card */}
        <div className="landing-hero-visual">
          <div className="landing-mock-card">
            <div className="landing-mock-header">
              <div className="landing-mock-dot red" />
              <div className="landing-mock-dot amber" />
              <div className="landing-mock-dot green" />
              <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--gray-400)" }}>
                deadlinedesk.vercel.app
              </span>
            </div>
            <div className="landing-mock-body">
              <div className="landing-mock-stat-row">
                {[
                  { label: "Total", value: "12", color: "var(--primary-600)", bg: "var(--primary-50)" },
                  { label: "Pending", value: "5",  color: "var(--amber-600)",   bg: "var(--amber-50)"   },
                  { label: "Done",    value: "6",  color: "var(--green-600)",   bg: "var(--green-50)"   },
                  { label: "Overdue", value: "1",  color: "var(--red-600)",     bg: "var(--red-50)"     },
                ].map((s) => (
                  <div key={s.label} className="landing-mock-stat" style={{ background: s.bg }}>
                    <span className="landing-mock-stat-value" style={{ color: s.color }}>{s.value}</span>
                    <span className="landing-mock-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
              {[
                { title: "Machine Learning Paper", subject: "AI", status: "overdue",   days: "2d ago" },
                { title: "DB Normalization",        subject: "DBMS", status: "pending", days: "3d left" },
                { title: "React Todo App",          subject: "Web Dev", status: "completed", days: "Done" },
              ].map((item) => (
                <div key={item.title} className="landing-mock-item">
                  <div style={{ flex: 1 }}>
                    <p className="landing-mock-item-title">{item.title}</p>
                    <p className="landing-mock-item-subject">{item.subject}</p>
                  </div>
                  <span className={`badge badge-${item.status}`}>{item.status}</span>
                  <span className="landing-mock-item-days">{item.days}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────── */}
      <section className="landing-stats-bar" id="stats">
        <div className="landing-container">
          <div className="landing-stats-grid">
            {[
              { value: "100%", label: "Free to use" },
              { value: "7",    label: "API endpoints" },
              { value: "MERN", label: "Full stack app" },
              { value: "∞",    label: "Assignments you can track" },
            ].map((s) => (
              <div key={s.label} className="landing-stat-item">
                <span className="landing-stat-value">{s.value}</span>
                <span className="landing-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="landing-section" id="features">
        <div className="landing-container">
          <div className="landing-section-header">
            <p className="landing-section-eyebrow">Features</p>
            <h2 className="landing-section-title">Everything you need to stay organised</h2>
            <p className="landing-section-sub">
              Built specifically for college students juggling multiple subjects and tight deadlines.
            </p>
          </div>

          <div className="landing-features-grid">
            {[
              {
                icon: <BarChart3 size={22} />,
                color: "var(--primary-600)",
                bg: "var(--primary-50)",
                title: "Live Dashboard",
                desc: "See all your stats at a glance — total, pending, completed, and overdue assignments updated in real time.",
              },
              {
                icon: <AlertTriangle size={22} />,
                color: "var(--red-600)",
                bg: "var(--red-50)",
                title: "Overdue Detection",
                desc: "Assignments past their due date are automatically flagged as overdue — no manual status changes needed.",
              },
              {
                icon: <Clock size={22} />,
                color: "var(--amber-600)",
                bg: "var(--amber-50)",
                title: "Upcoming Deadlines",
                desc: "A dedicated widget shows everything due in the next 7 days so you're never caught off guard.",
              },
              {
                icon: <Search size={22} />,
                color: "var(--blue-500)",
                bg: "var(--blue-50)",
                title: "Search & Filter",
                desc: "Instantly find any assignment by title, filter by subject, or narrow down by status.",
              },
              {
                icon: <CheckCircle2 size={22} />,
                color: "var(--green-600)",
                bg: "var(--green-50)",
                title: "Full CRUD",
                desc: "Add, edit, mark complete, and delete assignments with one click. Clean forms with validation built in.",
              },
              {
                icon: <Smartphone size={22} />,
                color: "var(--primary-600)",
                bg: "var(--primary-50)",
                title: "Fully Responsive",
                desc: "Works great on your phone, tablet, and laptop. Track deadlines wherever you are.",
              },
            ].map((f) => (
              <div key={f.title} className="landing-feature-card">
                <div className="landing-feature-icon" style={{ background: f.bg, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="landing-feature-title">{f.title}</h3>
                <p className="landing-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="landing-section landing-section-alt" id="how-it-works">
        <div className="landing-container">
          <div className="landing-section-header">
            <p className="landing-section-eyebrow">How it works</p>
            <h2 className="landing-section-title">Up and running in seconds</h2>
            <p className="landing-section-sub">
              No sign up required. Just open the app and start adding your assignments.
            </p>
          </div>

          <div className="landing-steps">
            {[
              {
                step: "01",
                title: "Open the dashboard",
                desc: 'Click "Get Started" and you land straight on your personal dashboard with live stats.',
              },
              {
                step: "02",
                title: "Add your assignments",
                desc: 'Hit "+ Add Assignment", fill in the title, subject, due date, and an optional description.',
              },
              {
                step: "03",
                title: "Track & manage",
                desc: "Watch your stats update live. Mark assignments done, edit details, or delete them when no longer needed.",
              },
              {
                step: "04",
                title: "Never miss a deadline",
                desc: "Check the Upcoming Deadlines widget daily. Overdue items are flagged automatically so nothing slips through.",
              },
            ].map((s, i) => (
              <div key={s.step} className="landing-step">
                <div className="landing-step-number">{s.step}</div>
                <div className="landing-step-content">
                  <h3 className="landing-step-title">{s.title}</h3>
                  <p className="landing-step-desc">{s.desc}</p>
                </div>
                {i < 3 && <div className="landing-step-arrow"><ArrowRight size={18} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────── */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-section-header">
            <p className="landing-section-eyebrow">Tech Stack</p>
            <h2 className="landing-section-title">Built with the MERN stack</h2>
            <p className="landing-section-sub">
              A real full-stack project — from MongoDB to a React frontend, deployed on the cloud.
            </p>
          </div>
          <div className="landing-tech-grid">
            {[
              { name: "MongoDB Atlas",  role: "Database",  color: "#00ED64", desc: "Cloud NoSQL database" },
              { name: "Express.js",     role: "Backend",   color: "#404040", desc: "Node.js web framework" },
              { name: "React.js",       role: "Frontend",  color: "#61DAFB", desc: "UI with Vite + JSX" },
              { name: "Node.js",        role: "Runtime",   color: "#8CC84B", desc: "JavaScript server runtime" },
              { name: "Render",         role: "API Host",  color: "#46E3B7", desc: "Backend deployment" },
              { name: "Vercel",         role: "Web Host",  color: "#000000", desc: "Frontend deployment" },
            ].map((t) => (
              <div key={t.name} className="landing-tech-card">
                <div className="landing-tech-dot" style={{ background: t.color }} />
                <div>
                  <p className="landing-tech-name">{t.name}</p>
                  <p className="landing-tech-role">{t.role} — {t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="landing-cta">
        <div className="landing-container">
          <div className="landing-cta-inner">
            <h2 className="landing-cta-title">Ready to take control of your assignments?</h2>
            <p className="landing-cta-sub">
              Free, fast, and works right in your browser. No account needed.
            </p>
            <Link to="/dashboard" className="btn btn-primary landing-hero-btn" style={{ background: "white", color: "var(--primary-700)" }}>
              Open DeadlineDesk <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-inner">
            <div className="landing-footer-brand">
              <div className="landing-logo">
                <div className="landing-logo-icon" style={{ width: "28px", height: "28px" }}>
                  <BookOpen size={14} />
                </div>
                <span className="landing-logo-text" style={{ fontSize: "15px" }}>DeadlineDesk</span>
              </div>
              <p className="landing-footer-tagline">
                A MERN stack college assignment tracker.
              </p>
            </div>
            <div className="landing-footer-links">
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <Link to="/dashboard">Open App</Link>
              <a href="https://github.com/Veekshitha-Sankuru/DeadlineDesk" target="_blank" rel="noreferrer">
                <Github size={14} style={{ display: "inline", marginRight: "4px" }} />
                GitHub
              </a>
            </div>
          </div>
          <div className="landing-footer-bottom">
            <p>Built with ❤️ as a MERN stack training project.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
