const it = require("ava").default;
const chai = require("chai");
var expect = chai.expect;
const startDB = require("../helpers/DB");
const { MongoMemoryServer } = require("mongodb-memory-server");
const {
  addUser,
  getAllUsers,
  getUserById,
  deleteUserById,
} = require("../controllers/user");
const sinon = require("sinon");
const utils = require("../helpers/utils");
const User = require("../models/user");

it.before(async (t) => {
  t.context.mongod = await MongoMemoryServer.create();
  process.env.MONGOURI = t.context.mongod.getUri("testing");
  await startDB();
});

it.after(async (t) => {
  await t.context.mongod.stop({ doCleanUp: true });
});
// it("should create one user", async (t) => {
//   const fullName = "marwan essam";
//   const request = {
//     body: {
//       firstName: "marwan",
//       lastName: "essam",
//       age: 24,
//       job: "php developer",
//     },
//   };
//   expectedResult = {
//     fullName,
//     age: 24,
//     job: "php developer",
//   };
//   const stub1 = sinon.stub(utils, "getFullName").callsFake((fname, lname) => {
//     expect(fname).to.be.equal(request.body.firstName);
//     expect(lname).to.be.equal(request.body.lastName);
//     return fullName;
//   });
//   t.teardown(async () => {
//     await User.deleteMany({
//       fullName: request.body.fullName,
//     });
//     stub1.restore();
//   });
//   const actualResult = await addUser(request);
//   expect(actualResult._doc).to.deep.equal({
//     _id: actualResult._id,
//     __v: actualResult.__v,
//     ...expectedResult,
//   });
//   const users = await User.find({
//     fullName,
//   }).lean();
//   expect(users).to.have.length(1);
//   expect(users[0]).to.deep.equal({
//     _id: actualResult._id,
//     __v: actualResult.__v,
//     ...expectedResult,
//   });
//   t.pass();
// });

it("should retrieve all users", async (t) => {
  const users = await getAllUsers();

  expect(users).to.be.an("array");
  expect(users).to.have.lengthOf(3);

  expect(users[0].fullName).to.equal("amr essam");
  expect(users[0].age).to.equal(30);
  expect(users[0].job).to.equal("developer");

  expect(users[1].fullName).to.equal("marwan essam");
  expect(users[1].age).to.equal(24);
  expect(users[1].job).to.equal("php developer");

  t.pass();
});

it("should retrieve a single user by ID", async (t) => {
  const user = await User.create({
    fullName: "marwan essam",
    age: 24,
    job: "php developer",
  });
  const userId = user._id.toString();
  const retrievedUser = await getUserById({ params: { userId } });

  expect(retrievedUser.fullName).to.equal("marwan essam");
  expect(retrievedUser.age).to.equal(24);
  expect(retrievedUser.job).to.equal("php developer");

  await user.deleteOne();
  t.pass();
});

it("user id is not valid", async (t) => {
  const user = await User.create({
    fullName: "marwan essam",
    age: 24,
    job: "php developer",
  });
  const invalidId = "invalidid";

  await t.throwsAsync(async () => {
    await getUserById({ params: { userId: invalidId } });
  });
  await user.deleteOne();

  t.pass();
});

it("should delete a user by ID", async (t) => {
  const user = await User.create({
    fullName: "marwan essam",
    age: 24,
    job: "php developer",
  });
  const userId = user._id.toString();
  await deleteUserById({ params: { userId } });

  const deletedUser = await User.findById(userId);

  expect(deletedUser).to.be.null;
  await user.deleteOne();

  t.pass();
});
