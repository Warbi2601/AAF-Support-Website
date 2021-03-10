const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");
const saltRounds = 10;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: {
    type: String,
    default: "client",
    enum: ["client", "admin", "support"],
  },
  accessToken: {
    type: String,
  },
});

UserSchema.pre("save", function (next) {
  debugger;
  if (this.isNew || this.isModified("password")) {
    const document = this;
    bcrypt.hash(this.password, saltRounds, function (err, hashedPassword) {
      if (err) {
        next(err);
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

UserSchema.methods.isCorrectPassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (err, same) {
    if (err) {
      callback(err);
    } else {
      callback(err, same);
    }
  });
};

UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", UserSchema);
