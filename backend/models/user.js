///////////////////////////////////////////////creation model utilisateur////////////////////////////////

const mongoose = require("mongoose"); //package pour MongoDB (DataBase) fonction schema //
const uniqueValidator = require("mongoose-unique-validator"); //package MUV pour email unique

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // unique = validator
  password: { type: String, required: true }, 
});

userSchema.plugin(uniqueValidator); //package MUV fonction plugin

module.exports = mongoose.model("User", userSchema); //package pour MongoDB (DataBase) fonction model /
