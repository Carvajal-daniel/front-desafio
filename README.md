# 💻 Frontend - Controle de Ponto

Interface web desenvolvida para consumo da API de controle de ponto.

## 🚀 Tecnologias

* Next.js
* TypeScript
* React

## ▶️ Como rodar o projeto

```bash
npm install
npm run dev
```

A aplicação ficará disponível em:

```
http://localhost:3000
```

## 🔗 Integração com a API

O frontend consome a API de controle de ponto para:

* Cadastro de colaboradores
* Registro de ponto
* Visualização de históricos

As requisições estão centralizadas em `services/api.ts`.

## 📂 Estrutura

* `app/` → rotas e páginas da aplicação
* `components/` → componentes reutilizáveis
* `services/` → comunicação com a API
* `lib/` → utilitários e funções auxiliares

## 💡 Observações

* O projeto utiliza o App Router do Next.js
* Estrutura organizada para facilitar manutenção e leitura
* Foco em simplicidade e funcionalidade (MVP)

## 📌 Considerações

O objetivo foi construir uma interface simples e funcional, permitindo interação completa com a API.
