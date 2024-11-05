// server.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDB");
const path = require("path");

// Load environment variables
dotenv.config();

// Initialize database connection
connectDB();

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

//  User Route setup
app.use('/api/v1/users', require('./routes/userRoute'));

//transcation routes

app.use('/api/v1/transactions' ,require('./routes/transactionRoutes'));

// app.delete('/api/v1/transactions/:id', require('./routes/deleteTransactions'));
app.use(express.static(path.join(__dirname, './client/build')))

app.get('*' , function(req ,res){
    res.sendFile(path.join(__dirname, './client/build/index.html'));
})
// Set the PORT from environment variables or use 8080 as default
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
