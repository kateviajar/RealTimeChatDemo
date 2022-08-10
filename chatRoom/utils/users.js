// 1-a users array for store user object
const users = [];

// 2-Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user); // add user to users array

  return user;
}

// 3-Get current user by id
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// 5-User leaves chat (remove user from users array by its index)
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  // if the user is exist
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// 6-Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

// 4-export functions
module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
