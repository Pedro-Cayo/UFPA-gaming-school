const mongoose = require("../db/conn");
const { Schema } = mongoose;

const Professor = mongoose.model(
  "Professor",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      image: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    { timestamps: true },
  ),
);

module.exports = Professor;
