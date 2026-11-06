import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import {
  createAssignment,
  getAssignmentById,
  updateAssignment,
} from "../services/api";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * AssignmentForm — Handles both creating a new assignment and editing an existing one.
 * - If the URL has an :id param, it fetches that assignment and pre-fills the form.
 * - On submit, it calls the appropriate API function (create or update).
 */
const AssignmentForm = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // Exists when editing, undefined when creating
  const isEditing = Boolean(id);

  // ── Form Field State ─────────────────────────────────
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    dueDate: "",
    status: "Pending",
  });

  // ── UI State ─────────────────────────────────────────
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [submitError, setSubmitError] = useState("");

  // If editing, load the existing assignment data into the form
  useEffect(() => {
    if (!isEditing) return;

    const fetchAssignment = async () => {
      try {
        const response = await getAssignmentById(id);
        const a = response.data.data;

        // Format the date to YYYY-MM-DD so the date input shows it correctly
        const formatted = a.dueDate
          ? new Date(a.dueDate).toISOString().split("T")[0]
          : "";

        setFormData({
          title: a.title || "",
          subject: a.subject || "",
          description: a.description || "",
          dueDate: formatted,
          status: a.status || "Pending",
        });
      } catch (err) {
        setSubmitError("Could not load assignment. Please go back and try again.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchAssignment();
  }, [id, isEditing]);

  // ── Input Handler ─────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ── Validation ────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    return newErrors;
  };

  // ── Submit Handler ────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // Client-side validation
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await updateAssignment(id, formData);
      } else {
        await createAssignment(formData);
      }
      // Go back to the assignments list on success
      navigate("/assignments");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Something went wrong. Please try again.";
      setSubmitError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Show spinner while fetching existing assignment for edit mode
  if (fetchLoading) return <LoadingSpinner message="Loading assignment..." />;

  return (
    <div>
      <PageHeader
        title={isEditing ? "Edit Assignment" : "New Assignment"}
        subtitle={
          isEditing
            ? "Update assignment details below"
            : "Fill in the details to track a new assignment"
        }
        onMenuToggle={onMenuToggle}
      />

      <div className="page-content">
        <div className="form-container">
          {/* Back Button */}
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginBottom: "20px" }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={14} />
            Go Back
          </button>

          <div className="form-card">
            <h2 style={{ fontSize: "18px", marginBottom: "4px" }}>
              {isEditing ? "Edit Assignment" : "Add New Assignment"}
            </h2>
            <p style={{ color: "var(--gray-400)", fontSize: "13px", marginBottom: "24px" }}>
              {isEditing
                ? "Make changes to your assignment below."
                : "All fields marked with * are required."}
            </p>

            {/* Server-side error message */}
            {submitError && (
              <div className="alert alert-error">
                <AlertCircle size={15} />
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Title */}
              <div className="form-group">
                <label className="form-label" htmlFor="title">
                  Assignment Title <span>*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className={`form-input ${errors.title ? "error" : ""}`}
                  placeholder="e.g. Research Paper on Machine Learning"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={200}
                />
                {errors.title && (
                  <span className="form-error">
                    <AlertCircle size={12} />
                    {errors.title}
                  </span>
                )}
              </div>

              {/* Subject */}
              <div className="form-group">
                <label className="form-label" htmlFor="subject">
                  Subject <span>*</span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  className={`form-input ${errors.subject ? "error" : ""}`}
                  placeholder="e.g. Database Management"
                  value={formData.subject}
                  onChange={handleChange}
                  maxLength={100}
                />
                {errors.subject && (
                  <span className="form-error">
                    <AlertCircle size={12} />
                    {errors.subject}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-input form-textarea"
                  placeholder="Describe the assignment requirements, instructions..."
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={1000}
                  rows={4}
                />
              </div>

              {/* Due Date & Status side by side */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="dueDate">
                    Due Date <span>*</span>
                  </label>
                  <input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    className={`form-input ${errors.dueDate ? "error" : ""}`}
                    value={formData.dueDate}
                    onChange={handleChange}
                  />
                  {errors.dueDate && (
                    <span className="form-error">
                      <AlertCircle size={12} />
                      {errors.dueDate}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="form-input filter-select"
                    style={{ width: "100%" }}
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <Save size={14} />
                  {loading
                    ? isEditing
                      ? "Saving..."
                      : "Adding..."
                    : isEditing
                    ? "Save Changes"
                    : "Add Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentForm;
