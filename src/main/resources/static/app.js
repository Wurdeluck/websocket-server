const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/ws',
    debug: function (str) {
        console.log('STOMP: ' + str);
    },
    // Automatically attempts reconnect every 200ms if disconnected.
    reconnectDelay: 200,
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ', frame);
    // Subscribing to the topic and parsing the full message object.
    stompClient.subscribe('/topic/chat-msgs', (msg) => {
        const message = JSON.parse(msg.body);
        showMessage(message);
    });
};

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    // Update connection status indicator
    if (connected) {
        $("#status-indicator").addClass("connected");
    } else {
        $("#status-indicator").removeClass("connected");
    }
}

function connect() {
    stompClient.activate();
    console.log("Connected");
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

function sendMessage() {
    // Use stompClient.active to check if a connection is active.
    if (!stompClient.active) {
        alert("Broker disconnected, can't send message.");
        return false;
    }
    stompClient.publish({
        destination: "/app/chat",
        // Use consistent keys "sender" and "content" for messages.
        body: JSON.stringify({
            sender: $("#name").val(),
            content: $("#chat-msg").val()
        })
    });
}

function showMessage(message) {
    const currentUser = $('#name').val().trim(); // Get the current user's name (trim whitespace)
    const isUser = message.sender === currentUser; // Check if the sender matches the current user
    // Use "user" if the message is from the current user; otherwise "other"
    const messageClass = isUser ? 'user' : 'other';
    // Display current user messages on the left and other messages on the right
    const alignment = isUser ? 'flex-start' : 'flex-end';

    $('#chat-messages').append(`
    <div class="message ${messageClass}" style="align-self: ${alignment};">
      <strong>${message.sender}:</strong> ${message.content}
    </div>
  `);

    // Auto-scroll to the bottom of the messages container
    const container = document.getElementById('chat-messages');
    container.scrollTop = container.scrollHeight;
}

// Setup event listeners on page load.
$(function () {
    // Prevent the default form submission if any form is added.
    $("form").on('submit', (e) => e.preventDefault());
    $("#connect").click(() => connect());
    $("#disconnect").click(() => disconnect());
    $("#send").click(() => sendMessage());
});
