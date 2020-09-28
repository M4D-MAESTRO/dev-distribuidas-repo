const users = [];

module.exports = {
  logUser(user) {
    users.push(user);
    return user;
  },

  getUser(id) {
    return users.find((user) => user.id === id);
  },

  getUsersByRoomId(roomId) {
    return users.filter((user) => {
      return user.roomId === roomId;
    });
  },

  removeUser(id) {
    const index = users.findIndex((user) => user.id === id);
    if (index != -1) users.splice(index, 1);
  },
};
