const blogsRouter = require("express").Router();
const Blog = require("../models/post");
const User = require("../models/user");
const { findById } = require("../models/post");
const jwt = require("jsonwebtoken");

//!routes

//get all
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});

//get by id
blogsRouter.get("/:id", (request, response) => {
  const blog = Blog.findById(request.params.id);

  if (blog) {
    response.json(blog);
  } else {
    response.status(404).send({ error: "Blog-post not found" }).end();
  }
});

//post
blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  const token = request.token;

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

  !body.likes ? (body.likes = 0) : {};

  if (!body.title || !body.url) {
    response.status(400).send({ error: "title, url or content missing" }).end();
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
    });

    const savedBlog = await blog.save();

    user.posts = user.posts.concat(savedBlog._id);
    await user.save();
    response.json(savedBlog);
  }
});

//delete
blogsRouter.delete("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  const token = request.token;

  const decodedToken = jwt.verify(token, process.env.SECRET);

  const user = await User.findById(decodedToken.id);

  console.log(blog);

  if (!blog) {
    response
      .status(404)
      .send({ note: "the blog post has already been deleted" })
      .end();
  } else if (!decodedToken.id || blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: "unauthorized action" }).end();
  }

  await Blog.findByIdAndDelete(blog.id);

  response.status(204).end();
});

//put (modify existing blog)
blogsRouter.put("/:id", async (request, response) => {
  const requestBody = request.body;

  let prevBlog = await Blog.findById(request.params.id);

  const blog = {
    title: requestBody.title || prevBlog.title,
    author: requestBody.author || prevBlog.author,
    url: requestBody.url || prevBlog.url,
    likes: requestBody.likes || prevBlog.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });

  response.json(updatedBlog);
});

module.exports = blogsRouter;
