import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { getAssignments, deleteAssignment, updateAssignment } from "../services/api";
import AssignmentCard from "../components/AssignmentCard";
import DeleteModal from "../components/DeleteModal";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";

/**
 * Assignments — Shows all assignments with search and filter controls.
 * Supports: search by title, filter by subject, filter by status.
 */
const Assignments = ({ onMenuToggle }) => {
  const navigate = useNavigate();

  // ── Data State ────────────────────────────────────────
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]); // Unique subjects for filter dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Filter State ──────────────────────────────────────
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // ── Delete Modal State ────────────────────────────────
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch Assignments ─────────────────────────────────
  // useCallback so this function can be referenced in useEffect without re-creating every render
  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (search.trim()) params.search = search;
      if (subjectFilter) params.subject = subjectFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await getAssignments(params);
      setAssignments(response.data.data);
    } catch (err) {
      setError("Failed to load assignments. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  }, [search, subjectFilter, statusFilter]);

  // Fetch all assignments on mount (no filters) to build subject dropdown
  const fetchAllSubjects = async () => {
    try {
      const response = await getAssignments();
      const unique = [
        ...new Set(response.data.data.map((a) => a.subject)),
      ].sort();
      setSubjects(unique);
    } catch (_) {
      // Fail silently, subjects dropdown just won't be populated
    }
  };

  useEffect(() => {
    fetchAllSubjects();
  }, []);

  // Re-fetch when any filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssignments();
    }, 300); // 300ms debounce on search input
    return () => clearTimeout(timer);
  }, [fetchAssignments]);

  // ── Mark as Completed ──────────────────────────────────
  const handleMarkDone = async (id) => {
    try {
      await updateAssignment(id, { status: "Completed" });
      fetchAssignments();
      fetchAllSubjects();
    } catch (_) {
      setError("Failed to update assignment status.");
    }
  };

  // ── Delete Handlers ───────────────────────────────────
  const handleDeleteClick = (id) => setDeleteId(id);
  const handleDeleteCancel = () => setDeleteId(null);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteAssignment(deleteId);
      setDeleteId(null);
      fetchAssignments();
      fetchAllSubjects();
    } catch (_) {
      setError("Failed to delete assignment. Please try again.");
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="All Assignments"
        subtitle={`${assignments.length} assignment${assignments.length !== 1 ? "s" : ""} found`}
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

        {/* Search & Filter Bar */}
        <div className="filters-bar">
          <div className="search-wrapper">
            <Search size={15} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Assignment List */}
        {loading ? (
          <LoadingSpinner />
        ) : assignments.length === 0 ? (
          <EmptyState
            title={search || subjectFilter || statusFilter ? "No results found" : "No assignments yet"}
            message={
              search || subjectFilter || statusFilter
                ? "Try adjusting your search or filter."
                : "Click 'Add Assignment' to track your first one."
            }
            showAdd={!search && !subjectFilter && !statusFilter}
          />
        ) : (
          <div className="assignments-grid">
            {assignments.map((a) => (
              <AssignmentCard
                key={a._id}
                assignment={a}
                onEdit={() => navigate(`/assignments/edit/${a._id}`)}
                onDelete={handleDeleteClick}
                onMarkDone={handleMarkDone}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <DeleteModal
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default Assignments;
