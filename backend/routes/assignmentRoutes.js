const express = require("express");
const router = express.Router();

const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getStats,
} = require("../controllers/assignmentController");

// GET /api/assignments/stats  — must be defined BEFORE /:id to avoid conflict
router.get("/stats", getStats);

// GET    /api/assignments      — get all assignments (supports search & filters)
// POST   /api/assignments      — create a new assignment
router.route("/").get(getAssignments).post(createAssignment);

// GET    /api/assignments/:id  — get one assignment
// PUT    /api/assignments/:id  — update one assignment
// DELETE /api/assignments/:id  — delete one assignment
router
  .route("/:id")
  .get(getAssignmentById)
  .put(updateAssignment)
  .delete(deleteAssignment);

module.exports = router;
