const mongoose = require("mongoose");

const vagaSchema = new mongoose.Schema(
  {
    cargo: {
      type: String,
      required: true,
      trim: true
    },

    empresa: {
      type: String,
      required: true,
      trim: true
    },

    valor: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Vaga", vagaSchema);