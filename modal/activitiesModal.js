const mongoose = require("mongoose");
const ActivitiesSchema = new mongoose.Schema({
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

const Activities = mongoose.model("Activities", ActivitiesSchema);
module.exports = Activities;
