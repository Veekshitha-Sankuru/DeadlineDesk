import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { getAssignments, deleteAssignment, updateAssignment } from "../services/api";
import AssignmentCard from "../components/AssignmentCard";
import DeleteModal from "../components/DeleteModal";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";

/**
 * PendingAssignments — Shows only assignments with status "Pending".
 * Overdue assignments (pending + past due date) also appear here.
 */
const PendingAssignments = ({ onMenuToggle }) => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAssignments({ status: "Pending" });
      setAssignments(response.data.data);
    } catch (_) {
      setError("Failed to load assignments. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleMarkDone = async (id) => {
    try {
      await updateAssignment(id, { status: "Completed" });
      fetchPending();
    } catch (_) {
      setError("Failed to update assignment.");
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteAssignment(deleteId);
      setDeleteId(null);
      fetchPending();
    } catch (_) {
      setError("Failed to delete assignment.");
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Separate overdue from regular pending for display
  const now = new Date();
  const overdue = assignments.filter((a) => new Date(a.dueDate) < now);
  const upcoming = assignments.filter((a) => new Date(a.dueDate) >= now);

  return (
    <div>
      <PageHeader
        title="Pending Assignments"
        subtitle={`${assignments.length} pending · ${overdue.length} overdue`}
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
        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <LoadingSpinner />
        ) : assignments.length === 0 ? (
          <EmptyState
            title="No pending assignments"
            message="Great job! You have no pending assignments right now."
            showAdd
          />
        ) : (
          <>
            {/* Overdue Section */}
            {overdue.length > 0 && (
              <section style={{ marginBottom: "32px" }}>
                <div className="section-heading">
                  <h2 style={{ color: "var(--red-600)" }}>
                    ⚠ Overdue ({overdue.length})
                  </h2>
                </div>
                <div className="assignments-grid">
                  {overdue.map((a) => (
                    <AssignmentCard
                      key={a._id}
                      assignment={a}
                      onEdit={() => navigate(`/assignments/edit/${a._id}`)}
                      onDelete={setDeleteId}
                      onMarkDone={handleMarkDone}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming Pending Section */}
            {upcoming.length > 0 && (
              <section>
                <div className="section-heading">
                  <h2>Upcoming ({upcoming.length})</h2>
                </div>
                <div className="assignments-grid">
                  {upcoming.map((a) => (
                    <AssignmentCard
                      key={a._id}
                      assignment={a}
                      onEdit={() => navigate(`/assignments/edit/${a._id}`)}
                      onDelete={setDeleteId}
                      onMarkDone={handleMarkDone}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {deleteId && (
        <DeleteModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteId(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default PendingAssignments;
