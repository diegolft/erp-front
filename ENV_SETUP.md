# Configuração de Variáveis de Ambiente

Para configurar as variáveis de ambiente do projeto, crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_API_URL=https://daphne-womanish-tate.ngrok-free.dev
VITE_API_KEY=sua-api-key-real-aqui
```

## Variáveis Necessárias

- `VITE_API_URL`: URL base da API
- `VITE_API_KEY`: Chave de autenticação da API

## Importante

⚠️ **NUNCA** commite o arquivo `.env` no Git! Ele contém informações sensíveis.

O arquivo `.env` deve estar no `.gitignore` para manter a segurança das suas credenciais.

## Como usar

As variáveis são acessadas através do arquivo `src/config/env.ts` que centraliza toda a configuração da aplicação.
