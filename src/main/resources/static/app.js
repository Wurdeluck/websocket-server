const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/ws',
    debug: function (str) {
        console.log('STOMP: ' + str);
    },
    reconnectDelay: 200,
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ', frame);
    // Subscribe to the chat topic.
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
    // Toggle status indicator color.
    if (connected) {
        $("#status-indicator").addClass("connected");
    } else {
        $("#status-indicator").removeClass("connected");
    }
}

function connect() {
    let userName = $("#name").val().trim();

    if (userName === "") {
        alert("Username cannot be empty.");
        return;
    }
    stompClient.activate();
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

function sendMessage() {
    if (!stompClient.active) {
        alert("Broker disconnected, can't send message.");
        return false;
    }
    // Publish message using keys "sender" and "content"
    stompClient.publish({
        destination: "/app/chat",
        body: JSON.stringify({
            sender: $("#name").val().trim(),
            content: $("#chat-msg").val()
        })
    });
    // Clear the message input once sent.
    $("#chat-msg").val('');
}

function showMessage(message) {
    const currentUser = $('#name').val().trim();
    const isUser = message.sender === currentUser;
    const messageClass = isUser ? 'user' : 'other';
    // For current user, display messages on the left; for others, on the right.
    const alignment = isUser ? 'flex-start' : 'flex-end';
    const notAlignment = isUser ? 'flex-end' : 'flex-start';

    $('#chat-messages').append(`
    <div style="display: flex; flex-direction: column; align-items: ${alignment}; margin-bottom: 10px;">
      <div class="message ${messageClass}" style="padding: 12px 16px; border-radius: 15px;">
        ${message.content}
      </div>
      <div class="sender-info" style="font-size: 0.8em; color: #555; margin-top: 5px; align-self: ${notAlignment};">
        ${message.sender}
      </div>
    </div>
  `);

    const container = document.getElementById('chat-messages');
    container.scrollTop = container.scrollHeight;
}

$(function () {
    // Prevent any default form submission.
    $("form").on('submit', (e) => e.preventDefault());

    $("#connect").click(() => connect());
    $("#disconnect").click(() => disconnect());
    $("#send").click(() => sendMessage());

    // Trigger sendMessage() when user hits Enter in the message input.
    $("#chat-msg").on("keyup", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});
