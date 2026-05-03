const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001; // Changed to 3001 to avoid "Address already in use" error
const DB_FILE = path.join(__dirname, 'bookings.json');

// Initialize JSON file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

app.use(cors());
app.use(express.json());

// --- ROUTES ---

// 1. Root
app.get('/', (req, res) => {
    res.send('VidyaShikhar API Running on Port 3001');
});

// 2. Submit Booking (POST /book-demo)
app.post('/book-demo', (req, res) => {
    const { name, email, phone, course } = req.body;
    
    if (!name || !email || !phone || !course) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const bookings = JSON.parse(fs.readFileSync(DB_FILE));
        const newBooking = { name, email, phone, course, date: new Date() };
        
        bookings.push(newBooking);
        fs.writeFileSync(DB_FILE, JSON.stringify(bookings, null, 2));
        
        console.log('✅ New Booking:', name);
        res.json({ success: true, message: "Booking Successful" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Database error" });
    }
});

// 3. Admin Login (POST /admin-login)
app.post('/admin-login', (req, res) => {
    const { email, password } = req.body;
    
    if (email === 'admin@gmail.com' && password === '123456') {
        res.json({ success: true, token: "admin_token_xyz_123" });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

// 4. Get All Bookings (GET /bookings)
app.get('/bookings', (req, res) => {
    try {
        const bookings = JSON.parse(fs.readFileSync(DB_FILE));
        res.json(bookings.reverse()); // Latest first
    } catch (err) {
        res.status(500).json({ error: "Could not read bookings" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server on http://localhost:${PORT}`);
});
