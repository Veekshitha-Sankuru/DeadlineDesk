import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { getAssignments, getStats, updateAssignment, deleteAssignment } from "../services/api";
import StatCard from "../components/StatCard";
import AssignmentCard from "../components/AssignmentCard";
import LoadingSpinner from "../components/LoadingSpinner";
import DeleteModal from "../components/DeleteModal";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";

/**
 * Dashboard — The home page.
 * Shows summary stats, recent assignments, and upcoming deadlines.
 * All numbers are fetched live from MongoDB via the /api/assignments/stats endpoint.
 */
const Dashboard = ({ onMenuToggle }) => {
  const navigate = useNavigate();

  // ── State ─────────────────────────────────────────────
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    upcoming: 0,
  });
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch all dashboard data ───────────────────────────
  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch stats and all assignments in parallel
      const [statsRes, allRes] = await Promise.all([
        getStats(),
        getAssignments(),
      ]);

      setStats(statsRes.data.data);

      const all = allRes.data.data;

      // Recent assignments: last 6 added (most recently created first)
      const recent = [...all]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);
      setRecentAssignments(recent);

      // Upcoming: Pending assignments due in the next 7 days, sorted soonest first
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const upcoming = all
        .filter(
          (a) =>
            a.status === "Pending" &&
            new Date(a.dueDate) >= now &&
            new Date(a.dueDate) <= weekFromNow
        )
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);
      setUpcomingAssignments(upcoming);
    } catch (err) {
      setError(
        "Could not connect to the server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ── Mark as complete ──────────────────────────────────
  const handleMarkDone = async (id) => {
    try {
      await updateAssignment(id, { status: "Completed" });
      fetchDashboardData();
    } catch (_) {
      setError("Failed to update assignment.");
    }
  };

  // ── Delete ────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteAssignment(deleteId);
      setDeleteId(null);
      fetchDashboardData();
    } catch (_) {
      setError("Failed to delete assignment.");
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Get today's greeting ──────────────────────────────
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Track your assignments and deadlines"
        onMenuToggle={onMenuToggle}
        actions={
          <button
            className="btn btn-primary"
            onClick={() => navigate("/assignments/new")}
          >
            <Plus size={15} />
            Add Assignment
          </button>
        }
      />

      <div className="page-content">
        {/* Error Banner */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Welcome Banner */}
        <div
          className="card card-body"
          style={{
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            border: "none",
            color: "white",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ fontSize: "22px", marginBottom: "6px", color: "white" }}>
            {getGreeting()} 👋
          </h2>
          <p style={{ opacity: 0.85, fontSize: "14px", color: "white" }}>
            You have{" "}
            <strong>{stats.pending}</strong> pending assignment
            {stats.pending !== 1 ? "s" : ""} and{" "}
            <strong>{stats.overdue}</strong> overdue. Stay on top of your deadlines!
          </p>
        </div>

        {/* Stat Cards */}
        <div className="stats-grid">
          <StatCard
            title="Total Assignments"
            value={stats.total}
            icon={<BookOpen size={18} />}
            bgColor="var(--primary-50)"
            color="var(--primary-600)"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<Clock size={18} />}
            bgColor="var(--amber-50)"
            color="var(--amber-600)"
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CheckCircle2 size={18} />}
            bgColor="var(--green-50)"
            color="var(--green-600)"
          />
          <StatCard
            title="Overdue"
            value={stats.overdue}
            icon={<AlertTriangle size={18} />}
            bgColor="var(--red-50)"
            color="var(--red-500)"
          />
        </div>

        {/* Two-column layout: Recent + Upcoming */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
          className="dashboard-grid"
        >
          {/* Recent Assignments */}
          <div>
            <div className="section-heading">
              <h2>Recent Assignments</h2>
              <Link to="/assignments" className="view-all">
                View all <ArrowRight size={12} style={{ display: "inline" }} />
              </Link>
            </div>

            {recentAssignments.length === 0 ? (
              <EmptyState
                title="No assignments yet"
                message="Add your first assignment to get started."
                showAdd
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {recentAssignments.map((a) => (
                  <AssignmentCard
                    key={a._id}
                    assignment={a}
                    onEdit={() => navigate(`/assignments/edit/${a._id}`)}
                    onDelete={setDeleteId}
                    onMarkDone={handleMarkDone}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Deadlines */}
          <div>
            <div className="section-heading">
              <h2>Upcoming Deadlines (7 days)</h2>
              <Link to="/pending" className="view-all">
                View pending <ArrowRight size={12} style={{ display: "inline" }} />
              </Link>
            </div>

            {upcomingAssignments.length === 0 ? (
              <div className="card card-body" style={{ textAlign: "center", padding: "40px 20px" }}>
                <Calendar
                  size={32}
                  style={{ color: "var(--gray-300)", margin: "0 auto 12px" }}
                />
                <p style={{ color: "var(--gray-400)", fontSize: "13px" }}>
                  No assignments due in the next 7 days.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {upcomingAssignments.map((a) => {
                  const daysLeft = Math.ceil(
                    (new Date(a.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div
                      key={a._id}
                      className="card card-body"
                      style={{
                        padding: "14px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: "13.5px",
                            color: "var(--gray-800)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {a.title}
                        </p>
                        <p style={{ fontSize: "12px", color: "var(--gray-400)", marginTop: "2px" }}>
                          {a.subject}
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: daysLeft <= 2 ? "var(--red-600)" : "var(--amber-600)",
                          background: daysLeft <= 2 ? "var(--red-50)" : "var(--amber-50)",
                          padding: "3px 8px",
                          borderRadius: "20px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {daysLeft === 0 ? "Due today" : daysLeft === 1 ? "Tomorrow" : `${daysLeft}d left`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <DeleteModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteId(null)}
          isDeleting={isDeleting}
        />
      )}

      {/* Responsive: stack dashboard grid on smaller screens */}
      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
