![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
# 🌱 Conecta Safra

> Plataforma que conecta produtores agrícolas às comunidades acadêmicas e instituições públicas de ensino, facilitando a doação de alimentos produzidos localmente.

---

## 📋 Índice

- [Sobre o projeto](#sobre)
- [Stack tecnológica](#stack)
- [Estrutura de pastas](#estrutura)
- [Instalação e execução](#instalacao)
- [Usuários e perfis](#perfis)
- [Fluxo principal](#fluxo)
- [Rotas da API](#api)
- [Banco de dados](#banco)
- [Deploy](#deploy)

---

## 🌾 Sobre o projeto <a name="sobre"></a>

O **Conecta Safra** é uma ponte digital entre a produção agrícola local e as comunidades acadêmicas de Pernambuco. A plataforma permite que produtores rurais disponibilizem alimentos excedentes para doação, que estudantes e servidores de instituições de ensino possam solicitá-los, e que a equipe administrativa gerencie e confirme todo o processo.

---


## 📁 Estrutura de pastas <a name="estrutura"></a>

```
conecta-safra/
├── prisma/
│   ├── schema.prisma          # Modelos do banco de dados
│   └── seed.ts                # Dados de exemplo
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   │   ├── users/                # CRUD de usuários
│   │   │   ├── foods/                # CRUD de alimentos
│   │   │   ├── donations/            # CRUD de doações
│   │   │   ├── receipts/             # CRUD de comprovantes
│   │   │   └── dashboard/stats/      # Estatísticas
│   │   ├── dashboard/
│   │   │   ├── admin/                # Painel administrativo
│   │   │   ├── produtor/             # Painel do produtor
│   │   │   ├── beneficiario/         # Painel do beneficiário
│   │   │   └── perfil/               # Perfil do usuário
│   │   ├── login/                    # Página de login
│   │   ├── register/                 # Página de cadastro
│   │   └── page.tsx                  # Landing page
│   ├── components/
│   │   ├── admin/                    # Componentes do admin
│   │   ├── donations/                # Tabela de doações
│   │   ├── foods/                    # Grid de alimentos
│   │   ├── layout/                   # Sidebar, navbar
│   │   ├── providers/                # SessionProvider
│   │   └── receipts/                 # Comprovante
│   ├── lib/
│   │   ├── auth.ts                   # Configuração NextAuth
│   │   ├── prisma.ts                 # Cliente Prisma singleton
│   │   └── utils.ts                  # Funções utilitárias
│   ├── types/
│   │   └── index.ts                  # Tipos TypeScript
│   └── middleware.ts                 # Proteção de rotas
├── .env.example
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

##  Instalação e execução <a name="instalacao"></a>

### Pré-requisitos

- Node.js 18+
- MySQL 8+ rodando localmente
- npm ou yarn

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/conecta-safra.git
cd conecta-safra

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações de banco e secret

# 4. Crie o banco de dados no MySQL
mysql -u root -p -e "CREATE DATABASE conecta_safra CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 5. Execute as migrations do Prisma
npx prisma db push

# 6. Popule o banco com dados de exemplo
npx ts-node prisma/seed.ts

# 7. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---


## 🔄 Fluxo principal <a name="fluxo"></a>

```
1. Cadastro        → Usuário cria conta (produtor ou beneficiário)
2. Solicitação     → Beneficiário seleciona alimentos e solicita doação
3. Comprovante     → Sistema emite comprovante automaticamente (REC-AAAAMMDD-XXXX)
4. Confirmação     → Admin confirma a doação no painel
5. Recebimento     → Beneficiário retira os alimentos
6. Finalização     → Admin marca como "Entregue" — processo concluído
```

---


## 🗄️ Banco de dados <a name="banco"></a>

### Modelos principais

- **User** — Usuários do sistema (produtor, admin, beneficiário)
- **Food** — Alimentos cadastrados pelos produtores
- **Donation** — Solicitações de doação
- **DonationItem** — Itens de cada doação
- **Receipt** — Comprovantes emitidos

### Comandos úteis Prisma

```bash
npx prisma studio          # Interface visual do banco
npx prisma db push         # Sincronizar schema com o banco
npx prisma generate        # Gerar cliente Prisma
npx prisma db seed         # Rodar seed
```

---

## ☁️ Deploy <a name="deploy"></a>

### Vercel (recomendado)

```bash
# 1. Instale o CLI da Vercel
npm i -g vercel

# 2. Faça login
vercel login

# 3. Deploy
vercel --prod
```

## 📄 Licença

MIT License — Conecta Safra © 2024
