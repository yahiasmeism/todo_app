require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnect');
const cors = require('cors');
const corsOption = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000;

// 1 setup connection mongo db
connectDB();
// 2 add cors
app.use(cors(corsOption));
// 3 add cookieParser
app.use(cookieParser());
// 4 add json
app.use(express.json());

//! routes
app.use('/api', require('./routes/api'));
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/todoRoutes'));

//! handle not found route
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('json')) {
        res.json({ error: '404 Not Found' });
    } else {
        res.type('html').send('<h1>404 Not Found</h1>');
    }
})

mongoose.connection.once('open', () => {
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
    })
});

mongoose.connection.on('error', (error) => {
    console.error(error);
});
