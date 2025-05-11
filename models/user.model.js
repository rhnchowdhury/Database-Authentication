const mongoose = require("mongoose");
var encrypt = require("mongoose-encryption");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

// password encryption using mongoose encryption
const encKey = process.env.ENC_SECRET_KEY;
userSchema.plugin(encrypt, { secret: encKey, encryptedFields: ["password"] });

module.exports = mongoose.model("user", userSchema);
