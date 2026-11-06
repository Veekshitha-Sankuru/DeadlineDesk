import { ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * EmptyState — Shown when no assignments are found.
 * Props:
 *   title    - heading text
 *   message  - description text
 *   showAdd  - boolean, whether to show "Add Assignment" button
 */
const EmptyState = ({
  title = "No assignments yet",
  message = "Start by adding your first assignment.",
  showAdd = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <ClipboardList size={32} />
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {showAdd && (
        <button
          className="btn btn-primary"
          onClick={() => navigate("/assignments/new")}
        >
          Add Assignment
        </button>
      )}
    </div>
  );
};

export default EmptyState;
