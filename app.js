
const express = require("express");
const cors = require("cors");

// Importar as rotas
const vagaRoutes = require("./src/routes/vagaRoutes");
const profissionalRoutes = require("./src/routes/profissionalRoutes");

const app = express();

// Permitir requisições do Front-End React
app.use(cors({
  origin: "http://localhost:5173"
}));

// Permitir receber dados JSON
app.use(express.json());

// Rota inicial
app.get("/", (req, res) => {
  res.json({
    mensagem: "API Trampo Certo funcionando!"
  });
});

// Rotas do CRUD de vagas
app.use("/api/vagas", vagaRoutes);

// Rotas do CRUD de profissionais
app.use("/api/profissionais", profissionalRoutes);

// Exportar a aplicação para os testes
module.exports = app;
