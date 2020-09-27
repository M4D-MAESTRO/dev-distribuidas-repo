let chat = document.getElementById("chat-log");
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
