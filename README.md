# Digital Store (Drip Store)

Oi! Esse é o meu projeto de estudo de uma loja virtual de tênis e streetwear feita com Next.js, React, TypeScript e Tailwind CSS.

Eu construí esse projeto para praticar o desenvolvimento de páginas completas de um e-commerce (página inicial, lista de produtos com filtros, página de detalhes do tênis, carrinho lateral, cadastro com busca de CEP e finalização de pedido).

## O que o projeto tem hoje

- **Página inicial:** carrossel de banners, coleções em destaque e vitrine com os produtos em alta.
- **Catálogo e filtros:** dá para buscar na barra do topo, filtrar por marca, categoria, gênero, estado (novo ou seminovo) e preço máximo, além de ordenar os resultados.
- **Página de categorias:** atalhos para ir direto para uma categoria, marca ou gênero.
- **Detalhes do produto:** galeria de fotos, escolha de cor, escolha de numeração e botão para colocar no carrinho.
- **Carrinho e checkout:** o carrinho mostra quanto falta para liberar frete grátis (acima de R$ 299), aceita o cupom `DRIP30` e salva os itens no navegador (`localStorage`) para você não perder nada ao atualizar a página.
- **Cadastro com ViaCEP:** quando você digita o CEP no formulário de cadastro, ele consulta a API do ViaCEP e preenche rua, bairro, cidade e estado sozinho.

## O que usei para fazer

- **Next.js (App Router)** e **React**
- **TypeScript** para tipar os produtos, carrinho e pedidos
- **Tailwind CSS** para os estilos e responsividade
- **Lucide React** para os ícones
- **Rotas de API do próprio Next.js (`app/api/*`)** para entregar os produtos, validar o cadastro/login e registrar os pedidos

## Como rodar na sua máquina

Você só precisa ter o **Node.js** (versão 20 ou superior) instalado no computador.

1. **Baixe o projeto (clone do repositório):**
   ```bash
   git clone https://github.com/SEU-USUARIO/digital-store.git
   cd digital-store
   ```
   *(Esse comando copia os arquivos do GitHub para uma pasta no seu PC e entra nela.)*

2. **Instale as dependências:**
   ```bash
   npm install
   ```
   *(Esse comando baixa todas as bibliotecas que o projeto precisa para funcionar, como o Next.js e o Tailwind.)*

3. **Configure as variáveis de ambiente:**
   Copie o arquivo `.env.example` e crie um chamado `.env.local` na raiz do projeto:
   ```bash
   cp .env.example .env.local
   ```
   Se estiver no Windows (PowerShell), você pode usar:
   ```powershell
   Copy-Item .env.example .env.local
   ```
   *(No `.env.local` ficam as configurações do projeto, como o endereço do ViaCEP e o valor mínimo do frete grátis. Se quiser ligar em uma API externa no futuro, é só preencher `NEXT_PUBLIC_API_URL` ou `STORE_API_URL`.)*

4. **Rode o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   *(Esse comando liga o projeto localmente. Depois que aparecer que está pronto, é só abrir `http://localhost:3000` no navegador.)*

## Outros comandos úteis

- **Conferir se tem erro de TypeScript:**
  ```bash
  npm run typecheck
  ```
- **Conferir regras do ESLint:**
  ```bash
  npm run lint
  ```
- **Gerar a versão final de produção e testar:**
  ```bash
  npm run build
  npm run start
  ```

## Como coloquei no ar (GitHub + Vercel)

1. Subi o código para um repositório no meu **GitHub**.
2. Acessei a **Vercel**, cliquei em **Add New Project** e escolhi o repositório.
3. Como o projeto já usa Next.js padrão e tem o arquivo `vercel.json`, a Vercel reconhece tudo sozinha (`npm install` e `npm run build`).
4. Se quiser alterar o nome da loja ou o valor do frete grátis direto lá na Vercel, é só cadastrar as variáveis do `.env.example` nas configurações de **Environment Variables** do projeto.
