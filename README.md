# Currículos Seguros

Sistema web acadêmico para cadastro, listagem e consulta de currículos com foco em contramedidas práticas contra vulnerabilidades clássicas da OWASP Top 10.

## Estrutura de pastas

```text
curriculo-seguro/
├── config/
├── controllers/
├── database/
├── models/
├── public/
│   ├── css/
│   └── js/
├── views/
├── .env.example
├── README.md
├── package.json
└── server.js
```

## Requisitos

- Node.js 18+ recomendado
- npm

## Instalação

```bash
npm install
```

## Banco de dados

O banco usa SQLite e é criado automaticamente na primeira execução em `database/curriculos.db`.

Para aplicar o schema manualmente, use o arquivo isolado:

```sql
-- database/schema.sql
CREATE TABLE IF NOT EXISTS curriculos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome VARCHAR(100) NOT NULL,
  telefone VARCHAR(15),
  email VARCHAR(100) NOT NULL,
  website VARCHAR(200),
  experiencia VARCHAR(2000) NOT NULL
);
```

## Execução

1. Copie `.env.example` para `.env` se quiser alterar a porta ou o caminho do banco.
2. Instale as dependências com `npm install`.
3. Inicie a aplicação com `npm start`.
4. Acesse `http://localhost:3000`.

## Rotas

- `GET /` ou `GET /curriculos` - listagem
- `GET /curriculos/novo` - formulário de cadastro
- `POST /curriculos` - persistência com PRG
- `GET /curriculos/:id` - consulta detalhada

## Segurança implementada

### SQL Injection

- As queries usam prepared statements com `?` em vez de concatenação.
- O modelo concentra todo acesso ao banco, facilitando auditoria.

### XSS

- Na entrada, os campos passam por trimming e remoção de tags HTML.
- Na saída, as views usam encoding contextual antes de renderizar valores dinâmicos.

### History manipulation e cache

- O fluxo de cadastro usa PRG: após o POST, o sistema redireciona para um GET.
- As respostas incluem `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`.
- Também são enviados `X-Content-Type-Options: nosniff` e `X-Frame-Options: DENY`.

### Validação em duas camadas

- O front-end aplica validação rápida para UX.
- O back-end repete a validação com limites, trimming e RegEx.

## Observações

- O website pode ser informado com ou sem `https://`; o back-end normaliza para URL segura quando necessário.
- O sistema foi estruturado em MVC com separação entre controlador, modelo e views.