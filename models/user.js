const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = Schema({
  email: {
    type: String,
    required: true,
  },
  fName: {
    type: String,
    required: true,
  },
  lName: {
    type: String,
    // required: true
  },
  image: {
    url: String,
    filename: String,
  },
  profileImage: {
  type: String,
  default: "/images/default-avatar.png",
},
mobile: {
  type: String,
  unique: true,
  sparse: true
},
isMobileVerified: {
  type: Boolean,
  default: false
},
provider: {
  type: String,
  enum: ["local", "google", "mobile"],
  default: "local"
},
phone: {
  type: String,
  unique: true,
  sparse: true
},
username: {
  type: String,
  unique: true,
  sparse: true
},
authProvider: {
  type: String,
  enum: ["local", "google", "phone"],
  default: "local"
},
isAdmin: {
  type: Boolean,
  default: false
}




});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
