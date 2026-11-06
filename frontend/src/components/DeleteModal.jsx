import { Trash2, X } from "lucide-react";

/**
 * DeleteModal — Confirmation dialog shown before deleting an assignment.
 * Props:
 *   onConfirm  - called when user confirms deletion
 *   onCancel   - called when user cancels
 *   isDeleting - boolean, shows loading state during API call
 */
const DeleteModal = ({ onConfirm, onCancel, isDeleting }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-icon">
          <Trash2 size={24} />
        </div>
        <h3>Delete Assignment?</h3>
        <p>
          This action cannot be undone. The assignment will be permanently
          removed from your tracker.
        </p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={isDeleting}>
            <X size={14} />
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={isDeleting}>
            <Trash2 size={14} />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
