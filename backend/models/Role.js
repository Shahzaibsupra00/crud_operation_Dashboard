const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    rolename: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Role", roleSchema);
