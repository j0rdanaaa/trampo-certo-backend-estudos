
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
/**
 * @swagger
 * /api/profissionais:
 *   post:
 *     summary: Cadastra um novo profissional
 *     description: Cria um profissional no sistema Trampo Certo.
 *     tags:
 *       - Profissionais
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - profissao
 *               - cidade
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Ana Silva
 *               profissao:
 *                 type: string
 *                 example: Garçonete
 *               cidade:
 *                 type: string
 *                 example: Florianópolis
 *               disponibilidade:
 *                 type: string
 *                 default: A combinar
 *                 example: Finais de semana
 *               experiencia:
 *                 type: string
 *                 default: ""
 *                 example: 2 anos em restaurantes
 *     responses:
 *       201:
 *         description: Profissional cadastrado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
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
/**
 * @swagger
 * /api/profissionais:
 *   get:
 *     summary: Lista todos os profissionais
 *     description: Retorna os profissionais cadastrados no Trampo Certo.
 *     tags:
 *       - Profissionais
 *     responses:
 *       200:
 *         description: Lista de profissionais retornada com sucesso.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get("/", async (req, res) => {
  try {
    const profissionais = await Profissional.find();

    return res.status(200).json(profissionais);
  } catch (erro) {
    return tratarErro(erro, res, "listar profissionais");
  }
});

// UPDATE - Atualizar profissional
/**
 * @swagger
 * /api/profissionais/{id}:
 *   put:
 *     summary: Atualiza um profissional
 *     description: Atualiza os dados de um profissional pelo ID.
 *     tags:
 *       - Profissionais
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do profissional no MongoDB.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Ana Silva
 *               profissao:
 *                 type: string
 *                 example: Bartender
 *               cidade:
 *                 type: string
 *                 example: Florianópolis
 *               disponibilidade:
 *                 type: string
 *                 example: Disponibilidade integral
 *               experiencia:
 *                 type: string
 *                 example: 3 anos em bares e restaurantes
 *     responses:
 *       200:
 *         description: Profissional atualizado com sucesso.
 *       400:
 *         description: Dados ou ID inválidos.
 *       404:
 *         description: Profissional não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
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
/**
 * @swagger
 * /api/profissionais/{id}:
 *   delete:
 *     summary: Exclui um profissional
 *     description: Remove um profissional cadastrado pelo ID.
 *     tags:
 *       - Profissionais
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do profissional que será excluído.
 *     responses:
 *       200:
 *         description: Profissional excluído com sucesso.
 *       400:
 *         description: ID inválido.
 *       404:
 *         description: Profissional não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
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
