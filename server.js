const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// --- 1. MONGODB CONNECTION SETUP ---
// REPLACE 'your_password' and the cluster link with the one from MongoDB Atlas Drivers
const DB_URI = "mongodb+srv://riya:ku123@cluster0.mongodb.net/KUPortal?retryWrites=true&w=majority";

mongoose.connect(DB_URI)
    .then(() => console.log("✅ Successfully connected to MongoDB Atlas"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- 2. DEFINE DATA SCHEMA ---
// This defines how a single attendance record looks in your database
const attendanceSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    enrollmentNumber: { type: String, required: true },
    dateSubmitted: { type: Date, default: Date.now }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

// --- 3. API ROUTES ---

// GET: Fetch all attendance records from MongoDB
app.get('/api/attendance', async (req, res) => {
    try {
        const records = await Attendance.find().sort({ dateSubmitted: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch records" });
    }
});

// POST: Save a new attendance record to MongoDB
app.post('/api/attendance', async (req, res) => {
    try {
        const newEntry = new Attendance({
            studentName: req.body["Student Full Name"],
            enrollmentNumber: req.body["Enrollment Number"]
        });
        
        await newEntry.save();
        res.status(200).json({ message: "Data saved to MongoDB Atlas!" });
    } catch (err) {
        res.status(400).json({ error: "Failed to save data", details: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});