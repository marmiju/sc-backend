const express = require('express');
const cors = require('cors');
const DB = require('./database/DB');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the School Backend API');
});

// debugging DB connection
DB.getConnection().catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
}).then(() => {
    console.log('Database connected successfully');
});

// API routes
app.use('/api', require('./routers/Routers'));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
