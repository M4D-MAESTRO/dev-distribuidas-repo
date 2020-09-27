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
          chat.innerHTML += `
              <div id="${message.id}" class="message">
                  <p>${message.author}</p>
                  <p>${message.body}</p>
                  <p><i>${message.timestamp}</i></p>
              </div>
          `;
        });
      }
    })
    .catch((e) => alert(e));
});

socket.on("message", (event) => {
  document.getElementById("title").innerHTML += event;
});
