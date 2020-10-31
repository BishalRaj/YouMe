const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  addedOn: {
    type: Date,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
