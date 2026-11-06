const Assignment = require("../models/Assignment");

/**
 * @desc    Create a new assignment
 * @route   POST /api/assignments
 * @access  Public
 */
const createAssignment = async (req, res, next) => {
  try {
    const { title, subject, description, dueDate, status } = req.body;

    // Create the assignment document in MongoDB
    const assignment = await Assignment.create({
      title,
      subject,
      description,
      dueDate,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    next(error); // Pass to centralized error handler
  }
};

/**
 * @desc    Get all assignments with optional search and filters
 * @route   GET /api/assignments
 * @access  Public
 * @query   search, subject, status
 */
const getAssignments = async (req, res, next) => {
  try {
    const { search, subject, status } = req.query;

    // Build the query filter object dynamically
    const filter = {};

    // Search by title (case-insensitive partial match)
    if (search && search.trim()) {
      filter.title = { $regex: search.trim(), $options: "i" };
    }

    // Filter by subject (case-insensitive exact match)
    if (subject && subject.trim()) {
      filter.subject = { $regex: `^${subject.trim()}$`, $options: "i" };
    }

    // Filter by status (must match enum exactly)
    if (status && (status === "Pending" || status === "Completed")) {
      filter.status = status;
    }

    // Fetch from MongoDB, sorted by due date (soonest first)
    const assignments = await Assignment.find(filter).sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single assignment by ID
 * @route   GET /api/assignments/:id
 * @access  Public
 */
const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      const error = new Error("Assignment not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing assignment
 * @route   PUT /api/assignments/:id
 * @access  Public
 */
const updateAssignment = async (req, res, next) => {
  try {
    const { title, subject, description, dueDate, status } = req.body;

    // findByIdAndUpdate returns the updated document with { new: true }
    // runValidators ensures Mongoose validation runs on update too
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { title, subject, description, dueDate, status },
      { new: true, runValidators: true }
    );

    if (!assignment) {
      const error = new Error("Assignment not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Assignment updated successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an assignment
 * @route   DELETE /api/assignments/:id
 * @access  Public
 */
const deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);

    if (!assignment) {
      const error = new Error("Assignment not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/assignments/stats
 * @access  Public
 */
const getStats = async (req, res, next) => {
  try {
    const now = new Date();

    const [total, completed, pending, overdue, upcoming] = await Promise.all([
      // Total assignments
      Assignment.countDocuments(),
      // Completed assignments
      Assignment.countDocuments({ status: "Completed" }),
      // Pending (not yet overdue)
      Assignment.countDocuments({ status: "Pending", dueDate: { $gte: now } }),
      // Overdue = Pending AND due date already passed
      Assignment.countDocuments({ status: "Pending", dueDate: { $lt: now } }),
      // Upcoming = due within the next 7 days and still Pending
      Assignment.countDocuments({
        status: "Pending",
        dueDate: { $gte: now, $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: { total, completed, pending, overdue, upcoming },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getStats,
};
