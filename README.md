# Desafio Técnico Jitterbit - API de Pedidos

Uma API REST desenvolvida em Node.js para gerenciamento de pedidos, com autenticação JWT e documentação via Swagger. Este projeto foi criado como parte do processo seletivo para a vaga de Analista de Sistemas Jr. na Jitterbit.

## 🚀 Visão Geral

O projeto simula um sistema de backend onde é possível criar, listar, buscar e deletar pedidos. A aplicação implementa práticas de segurança com autenticação via token Bearer (JWT) e validação de dados de entrada.

### Principais Funcionalidades
* **Autenticação JWT:** Proteção de rotas sensíveis.
* **CRUD de Pedidos:** Criação, leitura e exclusão de pedidos em memória.
* **Validação de Dados:** Garantia de integridade das requisições.
* **Documentação Interativa:** Swagger UI integrado.
* **Testes Automatizados:** Cobertura de testes com Jest e Supertest.

## 🛠️ Tecnologias Utilizadas

* **Node.js** (Runtime)
* **Express** (Framework Web)
* **JWT (JSON Web Token)** (Autenticação)
* **Swagger (swagger-jsdoc & swagger-ui-express)** (Documentação)
* **Jest & Supertest** (Testes)
* **Dotenv** (Gerenciamento de variáveis de ambiente)

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
* Node.js instalado (v14 ou superior recomendado)
* npm (gerenciador de pacotes)

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/GabrielGCIT/Desafio-API.git](https://github.com/GabrielGCIT/Desafio-API.git)
    cd Desafio-API
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto (ou renomeie o `.env.example`) com o seguinte conteúdo:
    ```env
    PORT=3000
    JWT_SECRET=sua_chave_secreta_aqui
    JWT_EXPIRATION=1h
    ```

4.  **Inicie o servidor:**
    ```bash
    npm start
    # Ou para modo de desenvolvimento com auto-reload:
    npm run dev
    ```

5.  **Acesse a API:**
    O servidor iniciará em `http://localhost:3000`.

## 📖 Documentação da API (Swagger)

A documentação interativa completa, onde você pode testar as rotas diretamente pelo navegador, está disponível em:

👉 **http://localhost:3000/api-docs**

## 🔐 Autenticação (Como testar)

Para acessar as rotas protegidas (`/order`), você precisa de um token.

1.  Faça uma requisição **POST** para `/auth/login` com um dos usuários de demonstração:
    * **Admin:** `{"username": "admin", "password": "admin123"}`
    * **Viewer:** `{"username": "viewer", "password": "viewer123"}`
2.  Copie o `token` retornado no JSON.
3.  Nas requisições seguintes, adicione o header:
    `Authorization: Bearer <seu_token>`
    *(No Swagger, clique no botão "Authorize" e cole o token)*.

## 📡 Endpoints Principais

| Método | Rota | Descrição | Autenticação |
| :--- | :--- | :--- | :---: |
| `POST` | `/auth/login` | Realiza login e retorna token JWT | ❌ |
| `POST` | `/order` | Cria um novo pedido | ✅ |
| `GET` | `/order/list` | Lista todos os pedidos | ✅ |
| `GET` | `/order/{id}` | Busca um pedido pelo ID | ✅ |
| `DELETE` | `/order/{id}` | Remove um pedido | ✅ |

## 🧪 Rodando os Testes

O projeto inclui testes automatizados para garantir o funcionamento dos endpoints e da autenticação.

Para executar os testes:
```bash
npm test