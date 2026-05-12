const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Armazenamento em memória (sem banco de dados)
let tasks = [
  { id: 1, title: 'Estudar CI/CD', completed: false, createdAt: new Date().toISOString() },
  { id: 2, title: 'Configurar GitHub Actions', completed: false, createdAt: new Date().toISOString() },
  { id: 3, title: 'Fazer deploy no Render', completed: true, createdAt: new Date().toISOString() },
];
let nextId = 4;

// GET /tasks - listar todas as tarefas
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// POST /tasks - criar nova tarefa
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'O campo "title" é obrigatório.' });
  }
  const task = {
    id: nextId++,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  res.status(201).json(task);
});

// PUT /tasks/:id - atualizar tarefa
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: 'Tarefa não encontrada.' });

  const { title, completed } = req.body;
  if (title !== undefined) task.title = title.trim();
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

// DELETE /tasks/:id - deletar tarefa
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Tarefa não encontrada.' });

  tasks.splice(index, 1);
  res.status(204).send();
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Todo API está rodando!', version: '1.0.1' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
