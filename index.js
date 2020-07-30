const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Blog = require("./models/post");

//!connection
// eslint-disable-next-line no-undef
const password = process.env.MONGODB_PASSWORD;

const mongoUrl = `mongodb+srv://fullstack:${password}@cluster0.jjehi.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

//!using middleware
app.use(cors());
app.use(express.json());

//!actions
app.get("/api/blogs", (request, response) => {
  Blog.find({})
    .then((blogs) => {
      response.json(blogs);
    })
    .catch((error) => next(error));
});

app.post("/api/blogs", (request, response, next) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => next(error));
});

//!port
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
