const request = require("supertest");
const app = require("../../app");
const Vaga = require("../models/Vaga");

jest.mock("../models/Vaga");

describe("Testes das rotas de vagas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TESTE 1 - GET: Listar vagas
  test("deve listar as vagas com sucesso", async () => {
    const vagas = [
      {
        _id: "123",
        cargo: "Garçom",
        empresa: "Restaurante Floripa",
        valor: 180
      }
    ];

    Vaga.find.mockResolvedValue(vagas);

    const resposta = await request(app)
      .get("/api/vagas");

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual(vagas);
  });

  // TESTE 2 - POST: Cadastrar vaga
  test("deve cadastrar uma vaga com sucesso", async () => {
    const novaVaga = {
      cargo: "Garçom",
      empresa: "Restaurante Floripa",
      valor: 180
    };

    Vaga.create.mockResolvedValue({
      _id: "123",
      ...novaVaga
    });

    const resposta = await request(app)
      .post("/api/vagas")
      .send(novaVaga);

    expect(resposta.status).toBe(201);
    expect(resposta.body.cargo).toBe("Garçom");
  });

  // TESTE 3 - POST: Dados inválidos
  test("deve retornar 400 ao cadastrar vaga inválida", async () => {
    const erro = new Error("O campo cargo é obrigatório");
    erro.name = "ValidationError";

    Vaga.create.mockRejectedValue(erro);

    const resposta = await request(app)
      .post("/api/vagas")
      .send({
        empresa: "Restaurante Floripa",
        valor: 180
      });

    expect(resposta.status).toBe(400);
    expect(resposta.body.mensagem).toBe(
      "Dados inválidos para cadastrar a vaga."
    );
  });

  // TESTE 4 - PUT: Atualizar vaga
  test("deve atualizar uma vaga com sucesso", async () => {
    const vagaAtualizada = {
      _id: "123",
      cargo: "Bartender",
      empresa: "Bar Floripa",
      valor: 200
    };

    Vaga.findByIdAndUpdate.mockResolvedValue(vagaAtualizada);

    const resposta = await request(app)
      .put("/api/vagas/123")
      .send({
        cargo: "Bartender",
        empresa: "Bar Floripa",
        valor: 200
      });

    expect(resposta.status).toBe(200);
    expect(resposta.body.vaga).toEqual(vagaAtualizada);
  });

  // TESTE 5 - DELETE: Excluir vaga
  test("deve excluir uma vaga com sucesso", async () => {
    Vaga.findByIdAndDelete.mockResolvedValue({
      _id: "123",
      cargo: "Garçom"
    });

    const resposta = await request(app)
      .delete("/api/vagas/123");

    expect(resposta.status).toBe(200);
    expect(resposta.body.mensagem).toBe(
      "Vaga excluída com sucesso!"
    );
  });

  // TESTE 6 - PUT: Vaga inexistente
  test("deve retornar 404 ao atualizar vaga inexistente", async () => {
    Vaga.findByIdAndUpdate.mockResolvedValue(null);

    const resposta = await request(app)
      .put("/api/vagas/123")
      .send({
        cargo: "Garçom",
        empresa: "Restaurante Floripa",
        valor: 180
      });

    expect(resposta.status).toBe(404);
    expect(resposta.body.mensagem).toBe(
      "Vaga não encontrada."
    );
  });

  // TESTE 7 - DELETE: Vaga não encontrada
  test("deve retornar 404 ao excluir vaga inexistente", async () => {
    Vaga.findByIdAndDelete.mockResolvedValue(null);

    const resposta = await request(app)
      .delete("/api/vagas/123");

    expect(resposta.status).toBe(404);

    expect(resposta.body.mensagem).toBe(
      "Vaga não encontrada."
    );
  });

  // TESTE 8 - PUT: ID inválido
  test("deve retornar 400 ao atualizar vaga com ID inválido", async () => {
    const erro = new Error("ID inválido");
    erro.name = "CastError";

    Vaga.findByIdAndUpdate.mockRejectedValue(erro);

    const resposta = await request(app)
      .put("/api/vagas/id-invalido")
      .send({
        cargo: "Garçom",
        empresa: "Restaurante Floripa",
        valor: 180
      });

    expect(resposta.status).toBe(400);

    expect(resposta.body.mensagem).toBe(
      "Dados ou ID inválidos."
    );
  });

  // TESTE 9 - GET: Erro interno do servidor
  test("deve retornar 500 ao ocorrer erro na listagem de vagas", async () => {
    const erro = new Error("Falha na conexão com o banco");

    Vaga.find.mockRejectedValue(erro);

    const resposta = await request(app)
      .get("/api/vagas");

    expect(resposta.status).toBe(500);

    expect(resposta.body.mensagem).toBe(
      "Erro ao buscar vagas."
    );
  });

  // TESTE 10 - POST: Erro interno do servidor
  test("deve retornar 500 ao ocorrer erro no cadastro de vaga", async () => {
    const erro = new Error("Falha inesperada no banco");

    Vaga.create.mockRejectedValue(erro);

    const resposta = await request(app)
      .post("/api/vagas")
      .send({
        cargo: "Garçom",
        empresa: "Restaurante Floripa",
        valor: 180
      });

    expect(resposta.status).toBe(500);

    expect(resposta.body.mensagem).toBe(
      "Erro interno ao cadastrar a vaga."
    );
  });

  // TESTE 11 - PUT: Erro interno ao atualizar vaga
  test("deve retornar 500 ao ocorrer erro na atualização de vaga", async () => {
    const erro = new Error("Falha inesperada no banco");

    Vaga.findByIdAndUpdate.mockRejectedValue(erro);

    const resposta = await request(app)
      .put("/api/vagas/123")
      .send({
        cargo: "Bartender",
        empresa: "Bar Floripa",
        valor: 200
      });

    expect(resposta.status).toBe(500);

    expect(resposta.body.mensagem).toBe(
      "Erro interno ao atualizar vaga."
    );
  });

  // TESTE 12 - DELETE: Erro interno ao excluir vaga
  test("deve retornar 500 ao ocorrer erro na exclusão de vaga", async () => {
    const erro = new Error("Falha inesperada no banco");

    Vaga.findByIdAndDelete.mockRejectedValue(erro);

    const resposta = await request(app)
      .delete("/api/vagas/123");

    expect(resposta.status).toBe(500);

    expect(resposta.body.mensagem).toBe(
      "Erro interno ao excluir vaga."
    );
  });

  // TESTE 13 - DELETE: ID inválido
  test("deve retornar 400 ao excluir vaga com ID inválido", async () => {
    const erro = new Error("ID inválido");
    erro.name = "CastError";

    Vaga.findByIdAndDelete.mockRejectedValue(erro);

    const resposta = await request(app)
      .delete("/api/vagas/id-invalido");

    expect(resposta.status).toBe(400);

    expect(resposta.body.mensagem).toBe(
      "ID da vaga inválido."
    );
  });

});
