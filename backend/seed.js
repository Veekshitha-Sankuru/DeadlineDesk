/**
 * seed.js — Optional script to insert sample assignments into MongoDB.
 * Run with:  node seed.js
 *
 * This is ONLY for demonstration. Delete or skip this in production.
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Assignment = require("./models/Assignment");

dotenv.config();

const sampleAssignments = [
  {
    title: "Research Paper on Machine Learning",
    subject: "Artificial Intelligence",
    description: "Write a 10-page research paper covering supervised and unsupervised learning algorithms with real-world examples.",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    status: "Pending",
  },
  {
    title: "Database Normalization Assignment",
    subject: "Database Management",
    description: "Normalize the given unnormalized relation to 3NF. Show all steps clearly with functional dependencies.",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    status: "Pending",
  },
  {
    title: "React Todo App Project",
    subject: "Web Development",
    description: "Build a functional Todo application using React hooks (useState, useEffect). Deploy on Vercel.",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
    status: "Pending",
  },
  {
    title: "Binary Search Tree Implementation",
    subject: "Data Structures",
    description: "Implement BST with insert, delete, search, and traversal operations in C++.",
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    status: "Completed",
  },
  {
    title: "Network Topology Lab Report",
    subject: "Computer Networks",
    description: "Configure and document a star topology using Cisco Packet Tracer. Submit screenshots and analysis.",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    status: "Pending",
  },
  {
    title: "Process Scheduling Algorithms",
    subject: "Operating Systems",
    description: "Simulate FCFS, SJF, and Round Robin scheduling. Calculate average waiting and turnaround times.",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    status: "Completed",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Remove existing data
    await Assignment.deleteMany({});
    console.log("🗑️  Cleared existing assignments");

    // Insert sample data
    const inserted = await Assignment.insertMany(sampleAssignments);
    console.log(`🌱 Inserted ${inserted.length} sample assignments`);

    mongoose.disconnect();
    console.log("✅ Seeding complete. Database disconnected.");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDB();
