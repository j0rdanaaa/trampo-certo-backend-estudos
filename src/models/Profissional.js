
const mongoose = require("mongoose");

const profissionalSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },

    profissao: {
      type: String,
      required: true,
      trim: true,
    },

    cidade: {
      type: String,
      required: true,
      trim: true,
    },

    disponibilidade: {
      type: String,
      default: "A combinar",
    },

    experiencia: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profissional", profissionalSchema);
