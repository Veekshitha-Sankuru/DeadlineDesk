import { Calendar, BookOpen, Pencil, Trash2, CheckCircle2 } from "lucide-react";

/**
 * isOverdue - Returns true if due date has passed and status is still Pending.
 * This is calculated on the frontend from the data — not a stored DB status.
 */
const isOverdue = (dueDate, status) => {
  return status === "Pending" && new Date(dueDate) < new Date();
};

/**
 * formatDate - Converts an ISO date string to a human-readable format.
 * e.g. "2024-12-15T00:00:00.000Z" → "Dec 15, 2024"
 */
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * AssignmentCard — Displays a single assignment as a card.
 * Props:
 *   assignment  - assignment object from MongoDB
 *   onEdit      - called with assignment when Edit is clicked
 *   onDelete    - called with assignment._id when Delete is clicked
 *   onMarkDone  - called with assignment._id when Mark Complete is clicked
 */
const AssignmentCard = ({ assignment, onEdit, onDelete, onMarkDone }) => {
  const overdue = isOverdue(assignment.dueDate, assignment.status);

  // Pick CSS class and badge based on effective status
  let cardClass = "assignment-card";
  let badge;

  if (assignment.status === "Completed") {
    cardClass += " completed";
    badge = <span className="badge badge-completed">✓ Completed</span>;
  } else if (overdue) {
    cardClass += " overdue";
    badge = <span className="badge badge-overdue">⚠ Overdue</span>;
  } else {
    badge = <span className="badge badge-pending">● Pending</span>;
  }

  return (
    <div className={cardClass}>
      {/* Header: title + status badge */}
      <div className="assignment-card-header">
        <h3 className="assignment-card-title">{assignment.title}</h3>
        {badge}
      </div>

      {/* Subject pill */}
      <div>
        <span className="assignment-card-subject">
          <BookOpen size={11} />
          {assignment.subject}
        </span>
      </div>

      {/* Description (truncated to 2 lines via CSS) */}
      {assignment.description && (
        <p className="assignment-card-description">{assignment.description}</p>
      )}

      {/* Due date */}
      <div className="assignment-card-meta">
        <span
          className={`assignment-card-date ${overdue ? "overdue" : ""}`}
        >
          <Calendar size={13} />
          {overdue ? "Was due: " : "Due: "}
          {formatDate(assignment.dueDate)}
        </span>
      </div>

      {/* Action buttons */}
      <div className="assignment-card-actions">
        {/* Only show "Mark Complete" for Pending assignments */}
        {assignment.status === "Pending" && (
          <button
            className="btn btn-success btn-sm"
            onClick={() => onMarkDone(assignment._id)}
            title="Mark as Completed"
          >
            <CheckCircle2 size={13} />
            Complete
          </button>
        )}

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onEdit(assignment)}
          title="Edit assignment"
        >
          <Pencil size={13} />
          Edit
        </button>

        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(assignment._id)}
          title="Delete assignment"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default AssignmentCard;
