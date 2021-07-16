const { required } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  isEmailVerified: {
    type: Boolean,
  },
  // profileInfo: {
  //   firstname: { type: String },
  //   lastname: { type: String },
  //   country: { type: String },
  //   state: { type: String },
  //   pincode: { type: Number },
  //   address: { type: String },
  // },
  // categories: {
  //   category: { type: String },
  //   platform: { type: String },
  //   instagram: {
  //     instaAccUsername: { type: String },
  //     instaAccLink: { type: String },
  //     followers: { type: Number },
  //   },
  //   youtube: {
  //     youtubeChannelName: { type: String },
  //     youtubeChannelLink: { type: String },
  //     followers: { type: Number },
  //   },
  // },
  role: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
