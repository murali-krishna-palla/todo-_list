const express = require("express");
const Todo = require("../models/todo");

const router = express.Router();

// CREATE todo
router.post("/", async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json(err);
  }
});

// GET all todos
router.get("/", async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

// UPDATE todo
router.put("/:id", async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(todo);
});

// DELETE todo
router.delete("/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Todo deleted" });
});

module.exports = router;
