import axios from "axios";

/**
 * api.js — Axios instance configured to talk to the DeadlineDesk backend.
 * All API calls go through this file so the base URL is managed in one place.
 *
 * The base URL comes from the VITE_API_URL environment variable.
 * In development this is http://localhost:5000
 * In production this should be your Render backend URL.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Assignment API Functions ─────────────────────────────────────────────────

/**
 * Fetch all assignments. Supports optional query parameters:
 * @param {Object} params - { search, subject, status }
 */
export const getAssignments = (params = {}) =>
  api.get("/api/assignments", { params });

/**
 * Fetch a single assignment by its MongoDB _id.
 * @param {string} id
 */
export const getAssignmentById = (id) => api.get(`/api/assignments/${id}`);

/**
 * Create a new assignment.
 * @param {Object} data - { title, subject, description, dueDate, status }
 */
export const createAssignment = (data) => api.post("/api/assignments", data);

/**
 * Update an existing assignment.
 * @param {string} id
 * @param {Object} data
 */
export const updateAssignment = (id, data) =>
  api.put(`/api/assignments/${id}`, data);

/**
 * Delete an assignment by ID.
 * @param {string} id
 */
export const deleteAssignment = (id) => api.delete(`/api/assignments/${id}`);

/**
 * Fetch dashboard statistics (totals, pending, completed, overdue).
 */
export const getStats = () => api.get("/api/assignments/stats");

export default api;
