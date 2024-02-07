const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

mongoose.connect('mongodb://localhost:27017/chat_app_db', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to MongoDB');
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

const userSchema = new mongoose.Schema({
    username: String,
    firstname: String,
    lastname: String,
    password: String,
    createdAt: { type: Date, default: Date.now }
});

const groupMessageSchema = new mongoose.Schema({
    from_user: String,
    room: String,
    message: String,
    date_sent: { type: Date, default: Date.now }
});

const privateMessageSchema = new mongoose.Schema({
    from_user: String,
    to_user: String,
    message: String,
    date_sent: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const GroupMessage = mongoose.model('GroupMessage', groupMessageSchema);
const PrivateMessage = mongoose.model('PrivateMessage', privateMessageSchema);


wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
