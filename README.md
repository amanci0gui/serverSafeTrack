## Descrição

SafeTrack é uma aplicação focada em segurança construída com NestJS que permite aos usuários reportar e acompanhar incidentes de segurança em localizações específicas. Os usuários podem criar, visualizar e gerenciar marcadores que representam diferentes tipos de ocorrências de segurança.

## Funcionalidades

- Autenticação e autorização de usuários
- Criação e gerenciamento de marcadores de incidentes
- Visualização de incidentes dos últimos 3 meses
- Controle de acesso baseado em papéis (USER e ADMIN)
- Exclusão lógica (soft delete) de marcadores

## Endpoints da API

### Usuários

- `POST /users` - Criar um novo usuário (registro)
  - Corpo da requisição: `{ name: string, email: string, password: string }`
  - Retorna o usuário criado (sem a senha)

- `POST /users/login` - Realizar login
  - Corpo da requisição: `{ email: string, password: string }`
  - Retorna o token JWT de autenticação


### Marcadores

- `POST /markers` - Criar um novo marcador
  - Requer papel USER ou ADMIN
  - Corpo da requisição: `{ latitude: number, longitude: number, title: string, category: string }`

- `GET /markers` - Obter todos os marcadores ativos dos últimos 3 meses

- `GET /markers/:id` - Obter um marcador específico pelo ID

- `GET /markers/:userId` - Obter todos os marcadores ativos criados por um usuário específico

- `DELETE /markers/:id` - Realizar soft delete de um marcador
  - Requer papel USER ou ADMIN
  - Usuários só podem deletar seus próprios marcadores (ADMIN pode deletar qualquer um)

## Configuração do Projeto

### Pré-requisitos
- Node.js
- Banco de dados relacional (no caso da aplicação estamos utilizando provisoriamente o sqlite, porém na versão final, mudaremos para PostgreSQL ou MySQL)
- npm ou yarn

### Instalação

1. Instalar dependências:
```bash
$ npm install
```

2. Configurar variáveis de ambiente:
```bash
# Criar arquivo .env na raiz do projeto com:
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
JWT_SECRET="sua-chave-secreta"
GOOGLE_MAPS_API_KEY="googlemaps-api-key"
```

3. Inicializar Prisma:
```bash
# Gerar Prisma Client
$ npx prisma generate

# Executar migrações
$ npx prisma migrate dev
```

## Executar o projeto

```bash
# ambiente de desenvolvimento
$ npm run start

# modo de observação (watch mode)
$ npm run start:dev

# ambiente de produção
$ npm run start:prod
```

## Executar testes

```bash
# testes unitários
$ npm run test

# testes end-to-end
$ npm run test:e2e

# cobertura de testes
$ npm run test:cov
```

## Implantação

Quando estiver pronto para implantar sua aplicação NestJS em produção, existem alguns passos importantes para garantir que ela funcione da maneira mais eficiente possível. Confira a [documentação de implantação](https://docs.nestjs.com/deployment) para mais informações.

Para implantar sua aplicação NestJS na AWS, você pode usar o [Mau](https://mau.nestjs.com), nossa plataforma oficial. O Mau torna a implantação simples e rápida, necessitando apenas de alguns passos simples:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

Com o Mau, você pode implantar sua aplicação com poucos cliques, permitindo que você foque no desenvolvimento de funcionalidades ao invés de gerenciar infraestrutura.

## Recursos

Confira alguns recursos úteis para trabalhar com NestJS:

- Visite a [Documentação do NestJS](https://docs.nestjs.com) para aprender mais sobre o framework.
- Para dúvidas e suporte, visite nosso [canal no Discord](https://discord.gg/G7Qnnhy).
- Para aprofundar seus conhecimentos, confira nossos [cursos](https://courses.nestjs.com/) oficiais em vídeo.
- Implante sua aplicação na AWS com ajuda do [NestJS Mau](https://mau.nestjs.com) em poucos cliques.
- Visualize o grafo da sua aplicação e interaja com ela em tempo real usando [NestJS Devtools](https://devtools.nestjs.com).
- Precisa de ajuda com seu projeto? Confira nosso [suporte empresarial](https://enterprise.nestjs.com).
- Para ficar atualizado, siga-nos no [X](https://x.com/nestframework) e [LinkedIn](https://linkedin.com/company/nestjs).
- Procurando emprego ou tem vagas para oferecer? Confira nosso [Quadro de Empregos](https://jobs.nestjs.com).

## Suporte

O Nest é um projeto de código aberto licenciado sob MIT. Ele pode crescer graças aos patrocinadores e ao suporte dos incríveis apoiadores. Se você gostaria de se juntar a eles, por favor [leia mais aqui](https://docs.nestjs.com/support).

## Contato

- Autor - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## Licença

Nest está sob a [licença MIT](https://github.com/nestjs/nest/blob/master/LICENSE).
