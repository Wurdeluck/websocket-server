const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/ws',
    debug: function (str) {
        console.log('STOMP: ' + str);
    },
    // If disconnected, it will retry after 200ms
    reconnectDelay: 200,
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/chat-msgs', (msg) => {
        showMessage(JSON.parse(msg.body).content);
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
    if (connected) {
        $("#conversation").show();
    } else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    stompClient.activate();
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    if (!stompClient.connected) {
        alert("Broker disconnected, can't send message.");
        return false;
    }
    stompClient.publish({
        destination: "/app/chat",
        body: JSON.stringify({'name': $("#name").val(), 'chatMsg': $("#chat-msg").val()})
    });
}

function showMessage(message) {
    const isUser = true;
    const messageClass = isUser ? 'user' : 'other';
    $("#chat-messages").append(`
        <div class="message ${messageClass}">
            <strong>${message.sender}:</strong> ${message.content}
        </div>
    `);
    // Auto-scroll to bottom
    const container = document.getElementById('chat-messages');
    container.scrollTop = container.scrollHeight;
}

$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    $("#connect").click(() => connect());
    $("#disconnect").click(() => disconnect());
    $("#send").click(() => sendName());
});