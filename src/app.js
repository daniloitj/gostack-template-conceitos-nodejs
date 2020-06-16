const express = require("express");
const { uuid } = require('uuidv4');
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const project = { id: uuid(), title: title, url: url, techs: techs, likes: 0 };
  repositories.push(project);
  return response.status(201).json(project);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
      return response.status(400).json({ error: 'repository not found'});
  }
  const likes = repositories[repositoryIndex].likes;
  const repository = {
      id, 
      title, 
      url,
      techs,
      likes,
  };

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
      return response.status(400).json({ error: 'repositoryIndex not found'});
  }
  
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
      return response.status(400).json({ error: 'repositoryIndex not found'});
  }

  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1;

  return response.status(201).json(repositories[repositoryIndex]);
});

module.exports = app;
