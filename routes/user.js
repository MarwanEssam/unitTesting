const {
  addUser,
  getAllUsers,
  getUserById,
  deleteUserById,
} = require("../controllers/user");

const routes = [
  {
    method: "POST",
    url: "/api/users",
    handler: addUser,
  },
  {
    method: "GET",
    url: "/api/users/:userId",
    handler: getUserById,
  },
  {
    method: "GET",
    url: "/api/users",
    handler: getAllUsers,
  },
  {
    method: "DELETE",
    url: "/api/users/:userId",
    handler: deleteUserById,
  },
];

module.exports = routes;
