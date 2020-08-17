const morgan = require("morgan");

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

const morganConfig = morgan(
  ":method :url :status :res[content-length] - :response-time ms :body"
);

const info = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...params);
  }
};

const error = (...params) => {
  console.error(...params);
};

module.exports = {
  info,
  error,
  morganConfig,
};
