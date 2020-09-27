const socket = require("../../bower_components/socket.io-client/dist/socket.io")(
  "http://localhost:3002"
);
const chat = document.getElementById("chat-log");

socket.on("connect", () => {
  fetch("/rooms/0?_embed=messages")
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw Error(res.error);
      else {
        res.messages.forEach((message) => {
          chat.innerHTML += parseMessage(message);
        });
      }
    })
    .catch((e) => alert(e));
});

socket.on("message", (event) => {
  chat.innerHTML += parseMessage(event);
});

document.chatForm.onsubmit = (e) => {
  e.preventDefault();
  socket.emit("chatMessage", e.target.elements.chatMessage.value);
  e.target.elements.chatMessage.value = "";
};

function parseMessage(message) {
  return `
    <div id="${message.id}" class="message">
        <p>${message.author}</p>
        <p>${message.body}</p>
        <p><i>${message.timestamp}</i></p>
    </div>
  `;
}
