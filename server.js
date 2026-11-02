require("dotenv").config();


const express = require("express");
const dns = require('node:dns');
const cors = require("cors");
const conectarBanco = require("./src/config/database");




dns.setServers([
   '8.8.8.8',
   '8.8.4.4',
]);




// Importar as rotas
const vagaRoutes = require("./src/routes/vagaRoutes");
const profissionalRoutes = require("./src/routes/profissionalRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

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

// Iniciar a aplicação
const iniciarServidor = async () => {
  try {
    await conectarBanco();

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (erro) {
    console.error("Não foi possível iniciar a API.");
    process.exit(1);
  }
};

iniciarServidor();
