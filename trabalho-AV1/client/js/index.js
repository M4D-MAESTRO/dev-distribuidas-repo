const socket = require("../../bower_components/socket.io-client/dist/socket.io")(
  "http://localhost:3002"
);
const chat = document.getElementById("chat-log");
localStorage.setItem("author", "Le Big Pepe BOI");
localStorage.setItem("currentRoomId", 0);

socket.on("connect", () => {
  fetch("/rooms/0?_embed=messages")
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw Error(res.error);
      else {
        res.messages.forEach((message) => {
          chat.innerHTML += parseMessage(message);
        });
        chat.scrollTop = chat.scrollHeight;
      }
    })
    .catch((e) => alert(e));
});

socket.on("message", (event) => {
  chat.innerHTML += parseMessage(event);
  chat.scrollTop = chat.scrollHeight;
});

socket.on("serverLog", (event) => {
  chat.innerHTML += parseServerLog(event);
  chat.scrollTop = chat.scrollHeight;
});

document.chatForm.onsubmit = (e) => {
  e.preventDefault();
  let message = {
    author: localStorage.getItem("author"),
    body: e.target.elements.chatMessage.value,
    roomId: localStorage.getItem("currentRoomId"),
  };
  socket.emit("chatMessage", message);
  e.target.elements.chatMessage.value = "";
  e.target.elements.chatMessage.focus();
};

function parseMessage(message) {
  return `
    <div id="${message.id}" class="message">
        <p>${message.author} - <span><i>${message.timestamp}</i></span></p>
        <p>${message.body}</p>
    </div>
  `;
}

function parseServerLog(message) {
  return `
    <div class="message server-log">
        <p>${message}</p>
    </div>
  `;
}
