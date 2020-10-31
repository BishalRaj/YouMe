const mongoose = require("mongoose");
const InquirySchema = new mongoose.Schema({
  email: {
    type: String,
  },
  message: {
    type: String,
  },
  time: {
    type: Date,
  },
});

const Inquiry = mongoose.model("Inquiry", InquirySchema);
module.exports = Inquiry;
