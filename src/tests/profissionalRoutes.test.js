const request = require("supertest");
const app = require("../../app");
const Profissional = require("../models/Profissional");

// Simular o modelo sem acessar o MongoDB Atlas
jest.mock("../models/Profissional");

describe("Testes das rotas de profissionais", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  // TESTE 1 - GET: Listar profissionais
  test("deve listar profissionais com sucesso", async () => {
    const profissionaisSimulados = [
      {
        nome: "Ana Silva",
        profissao: "Garçom",
        cidade: "Florianópolis",
        disponibilidade: "Finais de semana",
        experiencia: "2 anos",
      },
    ];

    Profissional.find.mockResolvedValue(profissionaisSimulados);

    const resposta = await request(app).get("/api/profissionais");

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual(profissionaisSimulados);
    expect(Profissional.find).toHaveBeenCalledTimes(1);
  });
  // TESTE 2 - POST: Cadastrar profissional
  test("deve cadastrar profissional com sucesso", async () => {
    const novoProfissional = {
      nome: "Ana Silva",
      profissao: "Garçom",
      cidade: "Florianópolis",
      disponibilidade: "Finais de semana",
      experiencia: "2 anos",
    };

    Profissional.create.mockResolvedValue({
      _id: "123456789012345678901234",
      ...novoProfissional,
    });

    const resposta = await request(app)
      .post("/api/profissionais")
      .send(novoProfissional);

    expect(resposta.status).toBe(201);
    expect(resposta.body.nome).toBe("Ana Silva");

    expect(Profissional.create).toHaveBeenCalledWith(novoProfissional);
  });
  // TESTE 3 - PUT: Atualizar profissional
  test("deve atualizar profissional com sucesso", async () => {
    const id = "123456789012345678901234";

    const dadosAtualizados = {
      nome: "Ana Silva",
      profissao: "Bartender",
      cidade: "Florianópolis",
      disponibilidade: "Finais de semana",
      experiencia: "3 anos",
    };

    Profissional.findByIdAndUpdate.mockResolvedValue({
      _id: id,
      ...dadosAtualizados,
    });

    const resposta = await request(app)
      .put(`/api/profissionais/${id}`)
      .send(dadosAtualizados);

    expect(resposta.status).toBe(200);
    expect(resposta.body.mensagem).toBe("Profissional atualizado com sucesso!");
    expect(resposta.body.profissional.profissao).toBe("Bartender");

    expect(Profissional.findByIdAndUpdate).toHaveBeenCalledWith(
      id,
      dadosAtualizados,
      { new: true, runValidators: true },
    );
  });
  // TESTE 4 - DELETE: Excluir profissional
  test("deve excluir profissional com sucesso", async () => {
    const id = "123456789012345678901234";

    Profissional.findByIdAndDelete.mockResolvedValue({
      _id: id,
      nome: "Ana Silva",
    });

    const resposta = await request(app).delete(`/api/profissionais/${id}`);

    expect(resposta.status).toBe(200);
    expect(resposta.body.mensagem).toBe("Profissional excluído com sucesso!");
    expect(Profissional.findByIdAndDelete).toHaveBeenCalledWith(id);
  });
  // TESTE 5 - PUT: Profissional não encontrado
  test("deve retornar 404 ao atualizar profissional inexistente", async () => {
    const id = "000000000000000000000000";

    Profissional.findByIdAndUpdate.mockResolvedValue(null);

    const resposta = await request(app).put(`/api/profissionais/${id}`).send({
      nome: "Ana Silva",
      profissao: "Bartender",
      cidade: "Florianópolis",
      disponibilidade: "Finais de semana",
      experiencia: "3 anos",
    });

    expect(resposta.status).toBe(404);
    expect(resposta.body.mensagem).toBe("Profissional não encontrado.");
  });
  // TESTE 6 - POST: Erro de validação
  test("deve retornar 400 ao cadastrar profissional inválido", async () => {
    const profissionalInvalido = {
      profissao: "Garçom",
      cidade: "Florianópolis",
    };

    const erro = new Error("O campo nome é obrigatório");
    erro.name = "ValidationError";

    Profissional.create.mockRejectedValue(erro);

    const resposta = await request(app)
      .post("/api/profissionais")
      .send(profissionalInvalido);

    expect(resposta.status).toBe(400);
    expect(resposta.body.mensagem).toBe("Dados ou ID inválidos.");
  });
  // TESTE 7 - GET: Erro interno do servidor
  test("deve retornar 500 ao ocorrer erro na listagem", async () => {
    const erro = new Error("Falha na conexão com o banco");

    Profissional.find.mockRejectedValue(erro);

    const resposta = await request(app).get("/api/profissionais");

    expect(resposta.status).toBe(500);

    expect(resposta.body.mensagem).toBe(
      "Erro interno ao listar profissionais.",
    );
  });
  // TESTE 8 - DELETE: Profissional inexistente
  test("deve retornar 404 ao excluir profissional inexistente", async () => {
    Profissional.findByIdAndDelete.mockResolvedValue(null);

    const resposta = await request(app).delete("/api/profissionais/123");

    expect(resposta.status).toBe(404);

    expect(resposta.body.mensagem).toBe("Profissional não encontrado.");
  });
  // TESTE 9 - PUT: Erro interno ao atualizar profissional
  test("deve retornar 500 ao ocorrer erro na atualização de profissional", async () => {
    const erro = new Error("Falha inesperada no banco");

    Profissional.findByIdAndUpdate.mockRejectedValue(erro);

    const resposta = await request(app).put("/api/profissionais/123").send({
      nome: "Maria Silva",
      profissao: "Garçonete",
      cidade: "Florianópolis",
      disponibilidade: "Noturno",
      experiencia: "2 anos",
    });

    expect(resposta.status).toBe(500);

    expect(resposta.body.mensagem).toBe(
      "Erro interno ao atualizar profissional.",
    );
  });
  // TESTE 10 - DELETE: Erro interno ao excluir profissional
  test("deve retornar 500 ao ocorrer erro na exclusão de profissional", async () => {
    const erro = new Error("Falha inesperada no banco");

    Profissional.findByIdAndDelete.mockRejectedValue(erro);

    const resposta = await request(app).delete("/api/profissionais/123");

    expect(resposta.status).toBe(500);

    expect(resposta.body.mensagem).toBe(
      "Erro interno ao excluir profissional.",
    );
  });
});
