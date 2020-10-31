const Connection = require("mongoose");
const db = require("./keys").MongoURI;
Connection.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
  .then(() => console.log("Connection to Database Established"))
  .catch((err) => console.log(err));
Connection.Promise = global.Promise;
// console.log("Connection to Database Established");
