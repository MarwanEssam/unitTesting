const utils = require("../helpers/utils");
const User = require("../models/user");
const addUser = async (request, reply) => {
  try {
    const userBody = request.body;

    userBody.fullName = utils.getFullName(
      userBody.firstName,
      userBody.lastName
    );
    delete userBody.firstName;
    delete userBody.lastName;
    const user = new User(userBody);
    const addedUser = await user.save();
    return addedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllUsers = async (request, reply) => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserById = async (request, reply) => {
  try {
    const userId = request.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return { message: "User not found" };
    }

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteUserById = async (request, reply) => {
  try {
    const userId = request.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return { message: "User not found" };
    }

    return { message: "User deleted successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  deleteUserById,
};

// getUsers
// getSingleUser
// deleteUser

// bonus : validation, updateUser
