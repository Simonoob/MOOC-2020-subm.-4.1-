const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/post");

const initialBlogs = [
  {
    title: "Test",
    author: "a1",
    url: "/String/",
    likes: 2,
  },
  {
    title: "Test 2",
    author: "a2",
    url: "/String2/",
    likes: 1,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two json blogs", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(response.body).toHaveLength(initialBlogs.length);
});

test("the blogs have specific IDs", async () => {
  const response = await api.get("/api/blogs");

  const id = JSON.stringify(response.body[0].id);
  expect(id).toBeDefined();
});

afterAll(() => {
  mongoose.connection.close();
});
