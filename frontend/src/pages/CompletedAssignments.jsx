import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { getAssignments, deleteAssignment } from "../services/api";
import AssignmentCard from "../components/AssignmentCard";
import DeleteModal from "../components/DeleteModal";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";

/**
 * CompletedAssignments — Shows only assignments with status "Completed".
 */
const CompletedAssignments = ({ onMenuToggle }) => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCompleted = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAssignments({ status: "Completed" });
      setAssignments(response.data.data);
    } catch (_) {
      setError("Failed to load assignments. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompleted();
  }, []);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteAssignment(deleteId);
      setDeleteId(null);
      fetchCompleted();
    } catch (_) {
      setError("Failed to delete assignment.");
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Completed Assignments"
        subtitle={`${assignments.length} completed assignment${assignments.length !== 1 ? "s" : ""}`}
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
            title="No completed assignments"
            message="Assignments you mark as complete will appear here. Keep it up!"
            showAdd={false}
          />
        ) : (
          <div className="assignments-grid">
            {assignments.map((a) => (
              <AssignmentCard
                key={a._id}
                assignment={a}
                onEdit={() => navigate(`/assignments/edit/${a._id}`)}
                onDelete={setDeleteId}
                onMarkDone={() => {}} // Already completed — no action needed
              />
            ))}
          </div>
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

export default CompletedAssignments;
