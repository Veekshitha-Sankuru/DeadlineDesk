import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Assignments from "./pages/Assignments";
import PendingAssignments from "./pages/PendingAssignments";
import CompletedAssignments from "./pages/CompletedAssignments";
import AssignmentForm from "./pages/AssignmentForm";

/**
 * App — Root component.
 * Sets up the sidebar + main content shell, and defines all page routes.
 *
 * Routes:
 *   /                     → Landing Page (public)
 *   /dashboard            → Dashboard
 *   /assignments          → All Assignments
 *   /assignments/new      → Add Assignment Form
 *   /assignments/edit/:id → Edit Assignment Form
 *   /pending              → Pending Assignments
 *   /completed            → Completed Assignments
 */
const App = () => {
  // Controls sidebar visibility on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  // Landing page gets its own full-screen layout (no sidebar)
  const isLanding = location.pathname === "/";

  if (isLanding) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    );
  }

  return (
    <div className="app-shell">
      {/* Left Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <main className="main-content">
        <Routes>
          <Route
            path="/dashboard"
            element={<Dashboard onMenuToggle={openSidebar} />}
          />
          <Route
            path="/assignments"
            element={<Assignments onMenuToggle={openSidebar} />}
          />
          <Route
            path="/assignments/new"
            element={<AssignmentForm onMenuToggle={openSidebar} />}
          />
          <Route
            path="/assignments/edit/:id"
            element={<AssignmentForm onMenuToggle={openSidebar} />}
          />
          <Route
            path="/pending"
            element={<PendingAssignments onMenuToggle={openSidebar} />}
          />
          <Route
            path="/completed"
            element={<CompletedAssignments onMenuToggle={openSidebar} />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
