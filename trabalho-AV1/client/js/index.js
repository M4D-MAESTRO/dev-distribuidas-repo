fetch("/rooms")
  .then((res) => res.json())
  .then((res) => {
    if (res.error) throw Error(res);
    else {
      res.forEach((r) => {
        document.getElementById("room-selector").innerHTML += `
        <option value="${r.id}">${r.name}</option>
      `;
      });
    }
  })
  .catch((e) => alert(e));

document.loginForm.onsubmit = (e) => {
  e.preventDefault();
  let targetRoom = e.target.elements.roomSelector.value;
  let username = e.target.elements.username.value;
  navigateToRoom(username, targetRoom);
};

document.roomForm.onsubmit = (e) => {
  e.preventDefault();
  let username = e.target.elements.username.value;
  let data = new FormData(e.target);
  data.delete("username");
  let options = {
    method: "POST",
    body: new URLSearchParams(data),
  };
  fetch("/rooms", options)
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw Error(res.error);
      else navigateToRoom(username, res.id);
    })
    .catch((e) => alert(e));
};

function navigateToRoom(username, targetRoom) {
  localStorage.setItem("author", username);
  localStorage.setItem("currentRoomId", parseInt(targetRoom));
  window.location.assign(window.location.href + "chat.html");
}

window.toggle = function (value) {
  document.getElementById("login-form").hidden = true;
  document.getElementById("create-room-form").hidden = true;
  document.getElementById(value).toggleAttribute("hidden");
};
