const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["admin", "manager", "member"],
      default: "member",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);