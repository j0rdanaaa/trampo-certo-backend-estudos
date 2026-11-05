const express = require("express");
const Vaga = require("../models/Vaga");

const router = express.Router();

// CREATE - Cadastrar uma nova vaga
/**
 * @swagger
 * /api/vagas:
 *   post:
 *     summary: Cadastra uma nova vaga
 *     description: Cria uma vaga no sistema Trampo Certo.
 *     tags:
 *       - Vagas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cargo
 *               - empresa
 *               - valor
 *             properties:
 *               cargo:
 *                 type: string
 *                 example: Garçom
 *               empresa:
 *                 type: string
 *                 example: Restaurante Floripa
 *               valor:
 *                 type: number
 *                 minimum: 0
 *                 example: 180
 *     responses:
 *       201:
 *         description: Vaga cadastrada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post("/", async (req, res) => {
  try {
    const { cargo, empresa, valor } = req.body;

    const novaVaga = await Vaga.create({
      cargo,
      empresa,
      valor,
    });

    res.status(201).json(novaVaga);
  } catch (erro) {
    console.error("Erro ao cadastrar vaga:", erro.message);

    if (erro.name === "ValidationError") {
      return res.status(400).json({
        mensagem: "Dados inválidos para cadastrar a vaga.",
        detalhe: erro.message,
      });
    }

    res.status(500).json({
      mensagem: "Erro interno ao cadastrar a vaga.",
    });
  }
});

// READ - Listar todas as vagas
/**
 * @swagger
 * /api/vagas:
 *   get:
 *     summary: Lista todas as vagas
 *     description: Retorna as vagas cadastradas no sistema Trampo Certo.
 *     tags:
 *       - Vagas
 *     responses:
 *       200:
 *         description: Lista de vagas retornada com sucesso.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get("/", async (req, res) => {
  try {
    const vagas = await Vaga.find();

    res.status(200).json(vagas);
  } catch (erro) {
    console.error("Erro ao listar vagas:", erro.message);

    res.status(500).json({
      mensagem: "Erro ao buscar vagas.",
    });
  }
});

// UPDATE - Atualizar uma vaga pelo ID
/**
 * @swagger
 * /api/vagas/{id}:
 *   put:
 *     summary: Atualiza uma vaga existente
 *     description: Atualiza os dados de uma vaga pelo ID.
 *     tags:
 *       - Vagas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da vaga no MongoDB.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cargo:
 *                 type: string
 *                 example: Garçom
 *               empresa:
 *                 type: string
 *                 example: Restaurante Floripa
 *               valor:
 *                 type: number
 *                 minimum: 0
 *                 example: 220
 *     responses:
 *       200:
 *         description: Vaga atualizada com sucesso.
 *       400:
 *         description: Dados ou ID inválidos.
 *       404:
 *         description: Vaga não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
router.put("/:id", async (req, res) => {
  try {
    const { cargo, empresa, valor } = req.body;

    const vagaAtualizada = await Vaga.findByIdAndUpdate(
      req.params.id,
      { cargo, empresa, valor },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!vagaAtualizada) {
      return res.status(404).json({
        mensagem: "Vaga não encontrada.",
      });
    }

    res.status(200).json({
      mensagem: "Vaga atualizada com sucesso!",
      vaga: vagaAtualizada,
    });
  } catch (erro) {
    console.error("Erro ao atualizar vaga:", erro.message);

    if (erro.name === "ValidationError" || erro.name === "CastError") {
      return res.status(400).json({
        mensagem: "Dados ou ID inválidos.",
        detalhe: erro.message,
      });
    }

    res.status(500).json({
      mensagem: "Erro interno ao atualizar vaga.",
    });
  }
});

// DELETE - Excluir uma vaga pelo ID
/**
 * @swagger
 * /api/vagas/{id}:
 *   delete:
 *     summary: Exclui uma vaga
 *     description: Remove uma vaga cadastrada pelo ID.
 *     tags:
 *       - Vagas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da vaga que será excluída.
 *     responses:
 *       200:
 *         description: Vaga excluída com sucesso.
 *       400:
 *         description: ID inválido.
 *       404:
 *         description: Vaga não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete("/:id", async (req, res) => {
  try {
    const vagaExcluida = await Vaga.findByIdAndDelete(req.params.id);

    if (!vagaExcluida) {
      return res.status(404).json({
        mensagem: "Vaga não encontrada.",
      });
    }

    res.status(200).json({
      mensagem: "Vaga excluída com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao excluir vaga:", erro.message);

    if (erro.name === "CastError") {
      return res.status(400).json({
        mensagem: "ID da vaga inválido.",
      });
    }

    res.status(500).json({
      mensagem: "Erro interno ao excluir vaga.",
    });
  }
});

// Exportar as rotas para o app.js
module.exports = router;
