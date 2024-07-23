function generateUniqueID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4();
}

let myID = sessionStorage.getItem("clientID");
if (!myID) {
  myID = generateUniqueID();
  sessionStorage.setItem("clientID", myID);
}

const ws = new WebSocket("ws://localhost:5000");
const button = document.querySelector("#send");
const messageInput = document.querySelector("#message");
const messagesContainer = document.querySelector("#messages");

ws.onopen = function () {
  button.disabled = false;
  ws.send(JSON.stringify({ type: "init", id: myID }));
  button.addEventListener("click", function () {
    const message = messageInput.value;
    ws.send(JSON.stringify({ type: "message", id: myID, message }));
    messageInput.value = "";
  });
};

ws.onmessage = function (event) {
  const data = JSON.parse(event.data);
  const messageDiv = document.createElement("div");
  messageDiv.className = "message";
  messageDiv.classList.add(data.id === myID ? "sent" : "received");
  messageDiv.textContent = data.message;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
};
