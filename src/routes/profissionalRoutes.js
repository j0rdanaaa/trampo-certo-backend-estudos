
const express = require("express");
const router = express.Router();

const Profissional = require("../models/Profissional");

// Função para tratar erros
const tratarErro = (erro, res, operacao) => {
  console.error(`Erro ao ${operacao}:`, erro.message);

  if (
    erro.name === "ValidationError" ||
    erro.name === "CastError" ||
    erro.name === "StrictModeError"
  ) {
    return res.status(400).json({
      mensagem: "Dados ou ID inválidos.",
      detalhe: erro.message
    });
  }

  return res.status(500).json({
    mensagem: `Erro interno ao ${operacao}.`
  });
};

// CREATE - Cadastrar profissional
router.post("/", async (req, res) => {
  try {
    const {
      nome,
      profissao,
      cidade,
      disponibilidade,
      experiencia
    } = req.body;

    const profissionalSalvo = await Profissional.create({
      nome,
      profissao,
      cidade,
      disponibilidade,
      experiencia
    });

    return res.status(201).json(profissionalSalvo);
  } catch (erro) {
    return tratarErro(erro, res, "cadastrar profissional");
  }
});

// READ - Listar profissionais
router.get("/", async (req, res) => {
  try {
    const profissionais = await Profissional.find();

    return res.status(200).json(profissionais);
  } catch (erro) {
    return tratarErro(erro, res, "listar profissionais");
  }
});

// UPDATE - Atualizar profissional
router.put("/:id", async (req, res) => {
  try {
    const {
      nome,
      profissao,
      cidade,
      disponibilidade,
      experiencia
    } = req.body;

    const profissionalAtualizado =
      await Profissional.findByIdAndUpdate(
        req.params.id,
        {
          nome,
          profissao,
          cidade,
          disponibilidade,
          experiencia
        },
        {
          new: true,
          runValidators: true
        }
      );

    if (!profissionalAtualizado) {
      return res.status(404).json({
        mensagem: "Profissional não encontrado."
      });
    }

    return res.status(200).json({
      mensagem: "Profissional atualizado com sucesso!",
      profissional: profissionalAtualizado
    });
  } catch (erro) {
    return tratarErro(erro, res, "atualizar profissional");
  }
});

// DELETE - Excluir profissional
router.delete("/:id", async (req, res) => {
  try {
    const profissionalExcluido =
      await Profissional.findByIdAndDelete(req.params.id);

    if (!profissionalExcluido) {
      return res.status(404).json({
        mensagem: "Profissional não encontrado."
      });
    }

    return res.status(200).json({
      mensagem: "Profissional excluído com sucesso!"
    });
  } catch (erro) {
    return tratarErro(erro, res, "excluir profissional");
  }
});

module.exports = router;
