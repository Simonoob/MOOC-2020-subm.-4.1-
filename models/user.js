const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

//Schema
const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  name: String,
  passwordHash: String,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

//Json formatting
userSchema.set("toJSON", {
  transform: (document, returnedData) => {
    returnedData.id = returnedData._id.toString();
    delete returnedData._id;
    delete returnedData.__v;
    delete returnedData.passwordHash;
  },
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = User;
