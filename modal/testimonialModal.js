const mongoose = require("mongoose");
const TestimonialSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  testimonial: {
    type: String,
  },
  grade: {
    type: String,
  },
  addedOn: {
    type: Date,
  },
});

const Testimonial = mongoose.model("Testimonial", TestimonialSchema);
module.exports = Testimonial;
