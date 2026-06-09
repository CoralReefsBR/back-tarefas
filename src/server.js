const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ⚠️ Substitua pelas URLs reais da Vercel e do Codespaces quando necessário
const corsOptions = {
  origin: [
    "https://front-tarefas-sandy.vercel.app/",
    "https://SEU-CODESPACE-8080.app.github.dev"
  ],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());

// Armazenamento em memória
let tasks = [
  { id: 1, title: 'Estudar CI/CD', completed: false, createdAt: new Date().toISOString() },
  { id: 2, title: 'Configurar GitHub Actions', completed: false, createdAt: new Date().toISOString() },
  { id: 3, title: 'Fazer deploy no Render', completed: true, createdAt: new Date().toISOString() },
];
let nextId = 4;

// GET / - health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Todo API está rodando!', version: '1.1.0' });
});

// GET /v1 - rota v1 com data/hora
app.get('/v1', (req, res) => {
  const agora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  res.json({
    message: 'Api v1 respondendo no container docker...',
    chamada_em: agora,
  });
});

// GET /tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// POST /tasks
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'O campo "title" é obrigatório.' });
  }
  const task = { id: nextId++, title: title.trim(), completed: false, createdAt: new Date().toISOString() };
  tasks.push(task);
  res.status(201).json(task);
});

// PUT /tasks/:id
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: 'Tarefa não encontrada.' });
  const { title, completed } = req.body;
  if (title !== undefined) task.title = title.trim();
  if (completed !== undefined) task.completed = completed;
  res.json(task);
});

// DELETE /tasks/:id
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Tarefa não encontrada.' });
  tasks.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
