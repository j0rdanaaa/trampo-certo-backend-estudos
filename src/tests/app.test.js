
const request = require("supertest");
const app = require("../../app");

describe("Testes da API Trampo Certo", () => {
  test("deve retornar status 200 na rota inicial", async () => {
    const resposta = await request(app).get("/");

    expect(resposta.status).toBe(200);
    expect(resposta.body.mensagem).toBe(
      "API Trampo Certo funcionando!"
    );
  });
});
