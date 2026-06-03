# 🎓 Sistema de Gamificação de Ensino UFPA

Um sistema web completo de gamificação de ensino para a Universidade Federal do Pará (UFPA), permitindo que professores criem questionários e alunos respondam com sistema de ranking e cronômetro.

## 📋 Requisitos

- **Node.js** 14+ (recomendado 16+)
- **npm** 6+ ou **yarn**
- **MongoDB** 4.0+ (instalado localmente ou acesso a MongoDB Atlas)

## 🚀 Instalação

### 1. Clonar ou Extrair o Projeto

```bash
# Se for um ZIP
unzip ufpa-gamificacao-v2.zip
cd ufpa-gamificacao-v2
```

### 2. Instalar Backend

```bash
cd backend
npm install
```

**Criar arquivo `.env` na pasta `backend`:**

```env
# Servidor
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ufpa_gamificacao

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui

# CORS
CORS_ORIGIN=http://localhost:3000
```

**Se usar MongoDB Atlas (nuvem):**

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/ufpa_gamificacao?retryWrites=true&w=majority
```

### 3. Instalar Frontend

```bash
cd front
npm install
```

**Criar arquivo `.env` na pasta `front`:**

```env
VITE_API_URL=http://localhost:5000/api
```

## ▶️ Executar o Projeto

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Você verá: `Server running on http://localhost:5000`

### Terminal 2 - Frontend

```bash
cd front
npm run dev
```

Você verá: `Local: http://localhost:3000`

## 📖 Como Usar

### 1️⃣ Acessar o Sistema

Abra o navegador em: **http://localhost:3000**

### 2️⃣ Registrar como Professor

1. Clique em **"Registrar"**
2. Selecione **"Professor"**
3. Preencha os dados:
   - **Nome**: Seu nome completo
   - **Email**: seu@email.com
   - **Telefone**: (XX) XXXXX-XXXX
   - **CNPJ**: 11.222.333/0001-81 (formato: XX.XXX.XXX/XXXX-XX)
   - **Senha**: Sua senha segura
4. Clique em **"Registrar"**

### 3️⃣ Registrar como Aluno

1. Clique em **"Registrar"**
2. Selecione **"Aluno"**
3. Preencha os dados:
   - **Nome**: Seu nome completo
   - **Email**: seu@email.com
   - **Telefone**: (XX) XXXXX-XXXX
   - **Matrícula**: 12 números (ex: 202401234567)
   - **Senha**: Sua senha segura
4. Clique em **"Registrar"**

### 4️⃣ Professor - Criar Disciplina

1. Faça login como professor
2. Clique em **"Nova Disciplina"**
3. Preencha:
   - **Nome**: Ex: Matemática I
   - **Código**: Ex: MAT001
   - **Descrição**: Descrição da disciplina
4. Clique em **"Criar"**

### 5️⃣ Professor - Criar Questionário

1. Na disciplina criada, clique em **"Novo Questionário"**
2. Preencha o **título** do questionário
3. Para cada uma das **10 questões**:
   - Digite o **texto da questão**
   - Preencha as **5 alternativas** (A, B, C, D, E)
   - Selecione a **resposta correta**
   - Defina os **pontos** (0.5, 1.0, 1.5 ou 2.0)
4. **Importante**: A soma total de pontos deve ser **exatamente 10**
5. Clique em **"Criar Questionário"**

### 6️⃣ Aluno - Responder Questionário

1. Faça login como aluno
2. Clique na **disciplina**
3. Clique em **"Responder"** no questionário
4. Para cada questão:
   - Leia a pergunta
   - Selecione uma alternativa (A-E)
   - O **cronômetro** registra o tempo de resposta
   - Clique em **"Próxima"** ou **"Anterior"** para navegar
5. Na última questão, clique em **"Enviar Respostas"**
6. Veja seu resultado!

### 7️⃣ Aluno - Ver Rankings

**Ranking por Disciplina:**
1. Na página da disciplina, clique em **"Ver Ranking"**
2. Veja os alunos ordenados pela pontuação
3. Em caso de empate, o tempo de resposta é o critério de desempate

**Ranking Geral:**
1. No painel do aluno, clique em **"Ranking Geral"**
2. Veja os alunos ordenados pela quantidade de questionários respondidos

### 8️⃣ Aluno - Perfil

1. Clique em **"Meu Perfil"**
2. Veja seus dados
3. Clique em **"Alterar Foto"** para fazer upload de uma foto de perfil

## 🔐 Validações

### CNPJ (Professor)

- Formato: XX.XXX.XXX/XXXX-XX
- Validação de checksum automática
- Exemplo válido: 11.222.333/0001-81

### Matrícula (Aluno)

- Deve ter **exatamente 12 dígitos**
- Exemplo: 202401234567

### Questionário

- **Exatamente 10 questões** por questionário
- **5 alternativas** por questão (A, B, C, D, E)
- **Pontos**: 0.5, 1.0, 1.5 ou 2.0
- **Soma total**: deve ser **exatamente 10 pontos**
- Sistema valida automaticamente antes de salvar

## 📊 Sistema de Pontuação

- **Acerto**: Aluno recebe os pontos da questão
- **Erro**: Aluno recebe 0 pontos
- **Tempo**: Registrado para desempate no ranking

## 🏆 Rankings

### Por Disciplina
- Ordenado pela **pontuação total** na disciplina
- Desempate: **menor tempo total** de resposta

### Geral
- Ordenado pela **quantidade de questionários respondidos**
- Mostra também a pontuação total

## 🛠️ Estrutura do Projeto

```
ufpa-gamificacao-v2/
├── backend/
│   ├── controllers/       # Lógica de negócio
│   ├── models/           # Modelos MongoDB
│   ├── routes/           # Rotas da API
│   ├── helpers/          # Funções auxiliares
│   ├── db/               # Conexão com banco
│   ├── public/           # Arquivos estáticos
│   ├── index.js          # Arquivo principal
│   ├── package.json
│   └── .env              # Variáveis de ambiente
│
├── front/
│   ├── src/
│   │   ├── pages/        # Páginas React
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── contexts/     # Context API
│   │   ├── services/     # Serviços de API
│   │   ├── App.jsx       # Componente principal
│   │   └── main.jsx      # Ponto de entrada
│   ├── public/           # Arquivos estáticos
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env              # Variáveis de ambiente
│
└── README.md
```

## 🐛 Troubleshooting

### Erro: "Cannot connect to MongoDB"

**Solução:**
1. Verifique se MongoDB está rodando: `mongosh`
2. Verifique a `MONGODB_URI` no `.env`
3. Se usar MongoDB Atlas, verifique a senha e IP whitelist

### Erro: "CORS error"

**Solução:**
1. Verifique se `CORS_ORIGIN` no backend está correto
2. Verifique se `VITE_API_URL` no frontend está correto
3. Reinicie ambos os servidores

### Erro: "Port already in use"

**Solução:**
1. Mude a porta no `.env` (ex: PORT=5001)
2. Ou mate o processo: `lsof -i :5000` e `kill -9 <PID>`

### Erro: "Invalid CNPJ"

**Solução:**
- Use um CNPJ válido com checksum correto
- Exemplo: 11.222.333/0001-81

### Erro: "Matrícula deve ter 12 dígitos"

**Solução:**
- Matrícula deve ter exatamente 12 números
- Exemplo: 202401234567

## 📚 Tecnologias Utilizadas

### Backend
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **CORS** - Compartilhamento de recursos
- **Multer** - Upload de arquivos

### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Build tool
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones

## 📝 Licença

Este projeto é fornecido como está para fins educacionais.

## 👨‍💻 Suporte

Para dúvidas ou problemas, verifique:
1. Este README
2. Os arquivos `.env.example`
3. Os logs do console (backend e frontend)

---

**Desenvolvido para UFPA** 🎓
