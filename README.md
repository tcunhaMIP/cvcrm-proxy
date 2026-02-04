# API Proxy para CV CRM

API serverless que funciona como proxy para envio de leads ao sistema CV CRM, implementando segurança através de CORS e autenticação via token.

## 📋 Descrição

Este endpoint recebe dados de leads de múltiplos sites autorizados e os encaminha de forma segura para a API do CV CRM. O proxy é necessário para:

- Proteger o token de autenticação do CV CRM (não exposto no frontend)
- Controlar quais domínios podem enviar leads
- Centralizar a lógica de comunicação com o CV CRM

## 🚀 Tecnologias

- Node.js
- Vercel Serverless Functions
- Fetch API

## 🔒 Segurança

### CORS (Cross-Origin Resource Sharing)

O endpoint aceita requisições apenas dos seguintes domínios autorizados:

**Produção:**
- jardins156.com.br (com e sem www)
- mipconstrutora.com.br (com e sem www)
- janeiroengenharia.com.br (com e sem www)
- carbonbyjaneiro.com.br (com e sem www)
- oneviewluxemburgo.com.br (com e sem www)
- cad-digital.vercel.app

**Desenvolvimento:**
- localhost:5500 (Live Server)
- localhost:5173 (Vite)
- 127.0.0.1:5500
- 127.0.0.1:5173

### Autenticação

O token de acesso ao CV CRM é armazenado como variável de ambiente na Vercel (`CVCRM_TOKEN`), garantindo que não seja exposto no código.
