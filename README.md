# 💼 Trampo Certo - API (Back-end)

> Plataforma para ligar estabelecimentos e profissionais de serviços temporários.

Este repositório contém o código-fonte do **Back-end** do projeto **Trampo Certo**. A API é responsável por gerir as regras de negócio, a persistência de dados e a integração entre os estabelecimentos (que oferecem as vagas) e os profissionais (freelancers).

---

## 🚀 Funcionalidades

Com base no levantamento de requisitos da Sprint 1[cite: 1], a API suporta o fluxo principal da aplicação:

- **Gestão de Vagas:**
  - `POST /vagas`: Criação de uma nova vaga pelo estabelecimento (validando campos obrigatórios e garantindo que o valor é superior a zero)[cite: 3].
  - `GET /vagas`: Listagem de oportunidades disponíveis para os profissionais[cite: 3].
- **Candidaturas:**
  - `POST /vagas/:id/candidatura`: Registo de interesse do profissional numa vaga específica, com validação para impedir candidaturas duplicadas.

*(Nota: O front-end inicial utilizou LocalStorage[cite: 2]. Esta API substitui essa camada, fornecendo uma base de dados centralizada e suporte multiutilizador[cite: 2].)*

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem:** Node.js / TypeScript
- **Framework:** Express 
- **Base de Dados:** PostgreSQL 
- **Autenticação:** JWT (JSON Web Token)
- **Documentação:** Swagger / OpenAPI

---

## ⚙️ Como executar o projeto localmente

### Pré-requisitos
- Node.js (v18+)
- Gestor de pacotes (npm ou yarn)
- PostgreSQL a correr localmente ou via Docker

### Passos de Instalação

1. **Clonar o repositório:**
   ```bash
   git clone [https://github.com/a-tua-organizacao/trampo-certo-backend.git](https://github.com/a-tua-organizacao/trampo-certo-backend.git)
