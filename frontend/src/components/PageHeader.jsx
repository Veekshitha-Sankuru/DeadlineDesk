import { Menu } from "lucide-react";

/**
 * PageHeader — Top bar shown on every page.
 * Props:
 *   title        - page title
 *   subtitle     - small description text under title
 *   onMenuToggle - called when hamburger menu is clicked (mobile)
 *   actions      - optional React node (e.g. "Add Assignment" button)
 */
const PageHeader = ({ title, subtitle, onMenuToggle, actions }) => {
  return (
    <header className="page-header">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Hamburger menu for mobile */}
        <button className="menu-toggle" onClick={onMenuToggle} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div className="page-header-left">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {actions && <div>{actions}</div>}
    </header>
  );
};

export default PageHeader;
