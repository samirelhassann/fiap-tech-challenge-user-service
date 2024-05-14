# FIAP SOAT - Grupo 65 - Tech Challenge #03 - Application

Repositório do Tech Challenge #03 da FIAP/Alura, no curso SOAT3. 

Este projeto é uma evolução do projeto do Tech Challenge #02. Nele foi realizado as seguintes implementações: 

- Implementação JWT via [fastify-jwt](https://www.npmjs.com/package/@fastify/jwt)
- Criado a esteira de DevOps para 
  - Rodar os testes unitários da aplicação
  - Rodar o [Sonar](https://sonarcloud.io/)
  - Atualizar a imagem no [Azure Container Registry](https://azure.microsoft.com/en-us/products/container-registry)
  - Deploy da aplicação no [Azure Kubernetes Services](https://azure.microsoft.com/pt-br/products/kubernetes-service)
- Proteção da branch master não permitindo commits diretos, e realizando as devidas checagem via gh actions nos pull requests
- Mudança na estrutura de usuários no banco de dados para melhor atender a autenticação via JWT e permissionamento via role (`ADMIN` e `CLIENT`)


## Como rodar a aplicação?

### Rodando Localmente

Pré-requisitos:

- [Node.js](https://nodejs.org/en) `>= 18.x`
- [Yarn](https://yarnpkg.com/) - versão usada localmente: `1.22.21`
- [Docker](https://www.docker.com/) - versão usada localmente: `4.27.2`

Após se certificado dos pré requisitos, siga o seguinte passo a passo:

1. Rode o docker compose para subir o banco de dados postgres
```bash
docker-compose up -d
```

2. Instale as dependências do projeto
```bash
yarn install
```

3. Atualize o prisma e subida das tabelas no banco de dados via migration
```bash
yarn prisma generate && yarn prisma migrate dev
```

4. Inicialize a aplicação
```bash
yarn dev
```

A aplicação estará disponível, por padrão, na rota [`http://localhost:3001`](http://localhost:3001).

# Documentação (API)

Ao rodar o projeto é possível acessar com o endpoint `/docs` a documentação completa no [Redoc](https://github.com/Redocly/redoc) ou em `/docs-swagger` para a visualização do [Swagger](swagger.io) padrão.

## Membros
- [Samir El Hassan](github.com/samirelhassann)
