require("dotenv").config();
// eslint-disable-next-line no-undef
const password = process.env.MONGODB_PASSWORD;

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;

module.exports = {
  password,
  PORT,
};
