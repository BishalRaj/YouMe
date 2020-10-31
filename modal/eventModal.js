const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  date: {
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

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
