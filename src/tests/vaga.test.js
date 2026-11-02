const Vaga = require("../models/Vaga");

describe("Testes do modelo Vaga", () => {
  test("não deve aceitar uma vaga sem cargo", async () => {
    const vaga = new Vaga({
      empresa: "Restaurante Teste",
      valor: 180
    });

    await expect(vaga.validate()).rejects.toThrow();
  });

test("não deve aceitar uma vaga com valor negativo", async () => {
  const vaga = new Vaga({
    cargo: "Garçom",
    empresa: "Restaurante Teste",
    valor: -50
  });

  await expect(vaga.validate()).rejects.toThrow();
});

test("deve aceitar uma vaga com dados válidos", async () => {
  const vaga = new Vaga({
    cargo: "Garçom",
    empresa: "Restaurante Teste",
    valor: 180
  });

  await expect(vaga.validate()).resolves.toBeUndefined();
});

});
