const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let likes = 0;
  blogs.forEach((post) => {
    likes += post.likes;
  });
  return likes;
};

const favouriteBlog = (blogs) => {
  let mostFavourite = blogs;

  mostFavourite.sort((prev, next) => (prev.likes > next.likes ? -1 : +1));

  return mostFavourite[0];
};

//!!continue here
const mostBlogs = (blogs) => {
  let authorsList = [];
  blogs.forEach((element) => {
    authorsList.some((post) => post.author === element.author)
      ? {}
      : authorsList.push(element);
  });

  authorsList.map((item) => (item.blogs = 0));

  blogs.forEach((element) => {
    authorsList.forEach((item) =>
      item.author === element.author ? (item.blogs += 1) : {}
    );
  });

  authorsList.sort((prev, next) => (prev.blogs > next.blogs ? -1 : +1));

  const mostWritings = {
    author: authorsList[0].author,
    blogs: authorsList[0].blogs,
  };

  return mostWritings;
};

let mostLikes = (blogs) => {
  let authorsList = [];

  blogs.forEach((element) => {
    authorsList.some((post) => post.author === element.author)
      ? {}
      : authorsList.push(element);
  });

  authorsList.map((item) => (item.votes = 0));

  blogs.forEach((element) => {
    authorsList.forEach((item) =>
      item.author === element.author ? (item.votes += element.likes) : {}
    );
  });

  authorsList.sort((prev, next) => (prev.likes > next.likes ? -1 : +1));

  const mostVotes = {
    author: authorsList[0].author,
    likes: authorsList[0].votes,
  };

  return mostVotes;
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
