const mongoose = require("mongoose");
const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  addedOn: {
    type: String,
  },
});

const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
