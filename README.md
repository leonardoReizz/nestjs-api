# NestJS API

Este é um projeto de API desenvolvido com [NestJS](https://nestjs.com/), um framework para construir aplicações Node.js escaláveis e eficientes.

## Pré-requisitos

- Node.js (versão 20 ou superior)
- Banco de dados PostgreSQL

## Configuração do Projeto

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/leonardoReizz/nestjs-api.git
   cd nestjs-api
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure o banco de dados:**

   Crie um banco de dados PostgreSQL e atualize o arquivo `.env` com as credenciais do banco de dados:

   ```
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
   ```

4. **Execute as migrações do Prisma:**

   ```bash
   npx prisma migrate dev
   ```

## Executando o Projeto

Para iniciar o servidor de desenvolvimento, execute:

```bash
npm run start:dev
```

A API estará disponível em `http://localhost:3000`.

## Testes

### Testes E2E

Para executar os testes de ponta a ponta, use:

```bash
npm run test:e2e
```

## Estrutura do Projeto

- **src/**: Contém o código-fonte da aplicação.
- **test/**: Contém os testes E2E.
- **prisma/**: Contém o esquema do Prisma e as migrações do banco de dados.

## Licença

Este projeto está licenciado sob a Licença MIT
