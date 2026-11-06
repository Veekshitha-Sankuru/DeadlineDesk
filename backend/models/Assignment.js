const mongoose = require("mongoose");

/**
 * Assignment Schema
 * Defines the structure of an assignment document in MongoDB.
 * Each assignment belongs to a student and has a due date and status.
 */
const assignmentSchema = new mongoose.Schema(
  {
    // Title of the assignment (required)
    title: {
      type: String,
      required: [true, "Assignment title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    // Subject/course the assignment belongs to (required)
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [100, "Subject cannot exceed 100 characters"],
    },

    // Detailed description of the assignment (optional)
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },

    // Deadline for the assignment (required)
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },

    // Current status — only "Pending" or "Completed" are valid values
    status: {
      type: String,
      enum: {
        values: ["Pending", "Completed"],
        message: 'Status must be either "Pending" or "Completed"',
      },
      default: "Pending",
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create a text index on title and subject for fast search queries
assignmentSchema.index({ title: "text", subject: "text" });

module.exports = mongoose.model("Assignment", assignmentSchema);
