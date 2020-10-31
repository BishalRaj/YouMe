const mongoose = require("mongoose");
const AdmissionSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  gender: {
    type: String,
  },
  nationality: {
    type: String,
  },
  dobBS: {
    type: String,
  },
  dobAD: {
    type: String,
  },
  grade: {
    type: String,
  },
  houseNo: {
    type: String,
  },
  area: {
    type: String,
  },
  ward: {
    type: String,
  },
  vdc: {
    type: String,
  },
  district: {
    type: String,
  },
  guardianName: {
    type: String,
  },
  relation: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  appliedOn: {
    type: String,
  },
});

const Admission = mongoose.model("Admission", AdmissionSchema);
module.exports = Admission;
