const mongo = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const userSchema = new mongo.Schema({
  username: {
    type: String,
    maxlength: 255,
    minlength: 5,
    required: true,
    unique: true
  },
  passwordHash: { type: String, maxlength: 255, minlength: 5, required: true },
  isAdmin: { type: Boolean, required: true, default: false }
});
userSchema.plugin(uniqueValidator);

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

userSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 12);
});

const userModel = mongo.model("User", userSchema);

module.exports.userModel = userModel;
