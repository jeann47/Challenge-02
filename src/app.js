const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [1,2,3];

const findById = (req, res, next) => {
  const {id} = req.params
  const index = repositories.findIndex(value => value.id === id)

  if(index < 0) return res.status(400).json(`Could not find a repository with id ${id}`)

  req.index = index;
  return next();
}

app.get("/repositories", (req, res) => {
  return res.json(repositories)
});

app.post("/repositories", (req, res) => {
  const {title, url, techs} = req.body;
  const repo = {id: uuid(), title, url, techs, likes: 0}

  repositories.push(repo)

  return res.json(repo)
});

app.put("/repositories/:id", findById, (req, res) => {
  const {title, url, techs} = req.body;

  repositories[req.index] = {id: req.params.id, title, url, techs, likes: repositories[req.index].likes}

  return res.json(repositories[req.index])
});

app.delete("/repositories/:id", findById, (req, res) => {

  repositories.splice(req.index, 1)

  return res.status(204).send()
});

app.post("/repositories/:id/like", findById, (req, res) => {

  repositories[req.index].likes++;

  return res.json(repositories[req.index])
});

module.exports = app;
