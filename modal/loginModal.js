const mongoose = require("mongoose");
const ArticleSchema = new mongoose.Schema({
  user_email: {
    type: String,
  },
  device_ip: {
    type: String,
  },
  login_time: {
    type: String,
  },
  device_info: {
    type: String,
  },
});

const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
