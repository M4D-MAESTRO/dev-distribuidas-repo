const users = [];

function logUser(user) {
  users.push(user);
  return user;
}

function getUser(id) {
  return users.find((user) => user.id === id);
}

module.exports = {
  logUser,
  getUser,
};
