const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);
//mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://crnaro:<password>@cluster0.wpnvsne.mongodb.net/googlebooks');
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');

module.exports = mongoose.connection;
