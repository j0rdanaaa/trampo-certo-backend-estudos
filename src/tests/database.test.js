
const mongoose = require("mongoose");
const conectarBanco = require("../config/database");

// Simula o Mongoose sem conectar ao MongoDB Atlas
jest.mock("mongoose", () => ({
  connect: jest.fn()
}));

describe("Testes de conexão com MongoDB", () => {
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();

    // Evita mensagens desnecessárias no terminal
    consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  // TESTE 1 - Conexão bem-sucedida
  test("deve conectar ao MongoDB com sucesso", async () => {
    mongoose.connect.mockResolvedValue(true);

    await conectarBanco();

    expect(mongoose.connect).toHaveBeenCalledWith(
      process.env.MONGO_URI
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "MongoDB conectado com sucesso!"
    );
  });

  // TESTE 2 - Falha na conexão
  test("deve lançar erro quando a conexão falhar", async () => {
    const erro = new Error("Falha na conexão");

    mongoose.connect.mockRejectedValue(erro);

    await expect(conectarBanco()).rejects.toThrow(
      "Falha na conexão"
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Erro ao conectar ao MongoDB:",
      "Falha na conexão"
    );
  });
});
