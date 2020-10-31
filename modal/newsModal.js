const mongoose = require("mongoose");
const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  showPopup: {
    type: Boolean,
  },
  addedOn: {
    type: String,
  },
});

const News = mongoose.model("News", NewsSchema);
module.exports = News;
