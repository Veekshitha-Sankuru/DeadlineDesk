import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  Clock,
  CheckCircle2,
  BookOpen,
  X,
} from "lucide-react";

/**
 * Sidebar — The left navigation panel.
 * Props:
 *   isOpen  - boolean, whether sidebar is visible (mobile toggle)
 *   onClose - function called when overlay is clicked (mobile)
 */
const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay shown on mobile when sidebar is open */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">
              <BookOpen size={18} />
            </div>
            <div className="logo-text">
              <h2>DeadlineDesk</h2>
              <p>Assignment Tracker</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <p className="nav-section-label">Menu</p>

          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>

          <NavLink
            to="/assignments"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <ListChecks size={16} />
            All Assignments
          </NavLink>

          <NavLink
            to="/pending"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <Clock size={16} />
            Pending
          </NavLink>

          <NavLink
            to="/completed"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <CheckCircle2 size={16} />
            Completed
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <p>DeadlineDesk v1.0.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
