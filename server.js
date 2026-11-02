
require("dotenv").config();

const dns = require("node:dns");
const conectarBanco = require("./src/config/database");
const app = require("./app");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    await conectarBanco();

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (erro) {
    console.error("Não foi possível iniciar a API.", erro.message);
    process.exit(1);
  }
};

iniciarServidor();
