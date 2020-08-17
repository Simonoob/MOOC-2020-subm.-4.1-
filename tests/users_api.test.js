const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");

const api = supertest(app);

const User = require("../models/user");
const { response } = require("express");

beforeEach(async () => {
  const initialUser = {
    username: "admin",
    password: "admin",
  };

  await User.deleteMany({});
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(initialUser.password, saltRounds);

  const user = new User({
    username: initialUser.username,
    name: initialUser.name,
    passwordHash,
  });

  await user.save();
});

test("users with unique username can be created", async () => {
  const user = {
    username: "freshUser",
    password: "password",
  };

  await api
    .post("/api/users")
    .send(user)
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("users can log-in with valid credentials and create new posts", async () => {
  const user = {
    username: "admin",
    password: "admin",
  };

  const response = await api
    .post("/api/login")
    .send(user)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const token = response.body.token;

  const blog = {
    title: "new post",
    likes: 2,
    author: "hlhj",
    url: "/String2/",
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `bearer ${token}`)
    .send(blog)
    .expect(200);
});
test("users cannot create new posts whitout a valid token", async () => {
  const blog = {
    title: "new post",
    likes: 2,
    author: "hlhj",
    url: "/String2/",
  };

  await api.post("/api/blogs").send(blog).expect(401);
});

test("users with the same username cannot be created", async () => {
  const user = {
    username: "admin",
    password: "password",
  };

  const response = await api
    .post("/api/users")
    .send(user)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  expect(response.body.error).toContain("`username` to be unique");
});

test("users with invalid credantials cannot be created", async () => {
  const user = {
    username: "du",
    password: "ddummypass",
  };

  const response = await api
    .post("/api/users")
    .send(user)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  expect(response.body.error).toContain(
    "Username should be at least 3 characters long"
  );
});

afterAll(() => {
  mongoose.connection.close();
});
