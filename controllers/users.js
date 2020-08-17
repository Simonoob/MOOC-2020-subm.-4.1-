const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

//!routes

//getAll
usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("posts", {
    title: 1,
    author: 1,
    likes: 1,
    url: 1,
  });
  response.json(users);
});

//create new user
usersRouter.post("/", async (request, response) => {
  const body = request.body;

  if (!body.username || body.username.length < 3) {
    return response.status(400).json({
      error: "Username should be at least 3 characters long",
    });
  } else if (!body.password || body.password.length < 3) {
    return response.status(400).json({
      error: "password should be at least 3 characters long",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

module.exports = usersRouter;
