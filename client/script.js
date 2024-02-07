document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");
    const chatRoom = document.getElementById("chat-room");
    const messageInput = document.getElementById("message-input");
    const sendMessageBtn = document.getElementById("send-message");
    const typingStatus = document.getElementById("typing-status");
    const logoutBtn = document.getElementById("logout");
    const roomList = document.getElementById("room-list");

    let currentUser = null;
    let currentRoom = null;

    signupForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const username = signupForm.querySelector("#username").value;
        const firstname = signupForm.querySelector("#firstname").value;
        const lastname = signupForm.querySelector("#lastname").value;
        const password = signupForm.querySelector("#password").value;

        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, firstname, lastname, password })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error during sign up:', error);
            });
    });

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const username = loginForm.querySelector("#login-username").value;
        const password = loginForm.querySelector("#login-password").value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                currentUser = data.user;
            })
            .catch(error => {
                console.error('Error during login:', error);
            });
    });

    sendMessageBtn.addEventListener("click", function() {
        const message = messageInput.value;
        if (message.trim() === '') return;

        const data = {
            message,
            room: currentRoom,
            user: currentUser.username
        };
        websocket.send(JSON.stringify(data));
        messageInput.value = "";
    });

    logoutBtn.addEventListener("click", function() {
        currentUser = null;
        currentRoom = null;
    });

    messageInput.addEventListener("input", function() {
        const isTyping = messageInput.value.trim() !== '';
        typingStatus.textContent = isTyping ? 'Typing...' : '';
    });

    function displayMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        chatRoom.appendChild(messageElement);
    }

    function updateRoomList(rooms) {
        roomList.innerHTML = '';
        rooms.forEach(room => {
            const option = document.createElement('option');
            option.textContent = room;
            roomList.appendChild(option);
        });
    }

    const websocket = new WebSocket('ws://localhost:3000');
    websocket.onopen = function(event) {
        console.log('Connected to WebSocket server');
        websocket.send(JSON.stringify({ action: 'getRooms' }));
    };

    websocket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if (data.action === 'receiveMessage') {
            displayMessage(data.message);
        } else if (data.action === 'updateRoomList') {
            updateRoomList(data.rooms);
        }
    };

    websocket.onclose = function(event) {
        console.log('Disconnected from WebSocket server');
    };
});
