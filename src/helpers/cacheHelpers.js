let loggedInUser = null;

function setLoggedInUser(user) {
  loggedInUser = user;
}

function getLoggedInUser() {
  return loggedInUser;
}

module.exports = {
  setLoggedInUser,
  getLoggedInUser,
};
