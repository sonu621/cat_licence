// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// require('dotenv').config();

// const app = express();

// // Connect to MongoDB
// const corsOptions = {
//     origin: '*'
// };

// app.use(cors(corsOptions));

// // Middleware
// app.use(express.json());
// // Uncomment if you have static files
// app.use(express.static('public'));

// // Routes
// app.use('/api/license', require('./routes/license'));
// app.get('/api/health', (req, res) => {
//     res.send('Server is running');
// });

// app.get('/', (req, res) => {
//     res.send('Server is running');
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });

// // Start the server
// const PORT = process.env.PORT || 500;
// app.listen(PORT, async () => {
//     try {
//        await connectDB();
//         console.log(`Server running on port ${PORT}`);
//     } catch (error) {
//         console.log('Error starting server:', error);
//     }
// });


//NEW CODE+++++=================

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
const corsOptions = {
    origin: '*'
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
// Uncomment if you have static files
app.use(express.static('public'));

// Routes
app.use('/api/license', require('./routes/license'));
app.get('/api/health', (req, res) => {
    res.send('Server is running');
});

app.get('/', (req, res) => {
    res.send('Server is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    try {
       await connectDB();
        console.log(`Server running on port ${PORT}`);
    } catch (error) {
        console.log('Error starting server:', error);
    }
});