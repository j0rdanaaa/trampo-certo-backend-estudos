
const express = require("express");
const Vaga = require("../models/Vaga");

const router = express.Router();

// CREATE - Cadastrar uma nova vaga
router.post("/", async (req, res) => {
  try {
    const { cargo, empresa, valor } = req.body;

    const novaVaga = await Vaga.create({
      cargo,
      empresa,
      valor
    });

    res.status(201).json(novaVaga);
  } catch (erro) {
    console.error("Erro ao cadastrar vaga:", erro.message);

    if (erro.name === "ValidationError") {
      return res.status(400).json({
        mensagem: "Dados inválidos para cadastrar a vaga.",
        detalhe: erro.message
      });
    }

    res.status(500).json({
      mensagem: "Erro interno ao cadastrar a vaga."
    });
  }
});

// READ - Listar todas as vagas cadastradas
router.get("/", async (req, res) => {
  try {
    const vagas = await Vaga.find();

    res.status(200).json(vagas);
  } catch (erro) {
    console.error("Erro ao listar vagas:", erro.message);

    res.status(500).json({
      mensagem: "Erro ao buscar vagas."
    });
  }
});

// UPDATE - Atualizar uma vaga pelo ID
router.put("/:id", async (req, res) => {
  try {
    const { cargo, empresa, valor } = req.body;

    const vagaAtualizada = await Vaga.findByIdAndUpdate(
      req.params.id,
      { cargo, empresa, valor },
      {
        new: true,
        runValidators: true
      }
    );

    if (!vagaAtualizada) {
      return res.status(404).json({
        mensagem: "Vaga não encontrada."
      });
    }

    res.status(200).json({
      mensagem: "Vaga atualizada com sucesso!",
      vaga: vagaAtualizada
    });

  } catch (erro) {
    console.error("Erro ao atualizar vaga:", erro.message);

    if (
      erro.name === "ValidationError" ||
      erro.name === "CastError"
    ) {
      return res.status(400).json({
        mensagem: "Dados ou ID inválidos.",
        detalhe: erro.message
      });
    }

    res.status(500).json({
      mensagem: "Erro interno ao atualizar vaga."
    });
  }
});
// DELETE - Excluir uma vaga pelo ID
router.delete("/:id", async (req, res) => {
  try {
    const vagaExcluida = await Vaga.findByIdAndDelete(
      req.params.id
    );

    if (!vagaExcluida) {
      return res.status(404).json({
        mensagem: "Vaga não encontrada."
      });
    }

    res.status(200).json({
      mensagem: "Vaga excluída com sucesso!"
    });

  } catch (erro) {
    console.error("Erro ao excluir vaga:", erro.message);

    if (erro.name === "CastError") {
      return res.status(400).json({
        mensagem: "ID da vaga inválido."
      });
    }

    res.status(500).json({
      mensagem: "Erro interno ao excluir vaga."
    });
  }
});
module.exports = router;
