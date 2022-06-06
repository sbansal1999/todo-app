const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json()); //req.body

//Routes

//create a todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all todos

app.get("/todos", async (req, res) => {
  try {
    const allTodo = await pool.query("SELECT * FROM todo");

    res.json(allTodo.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a todo

app.get("/todos/:id", async (req, res) => {
  try {
    const todo = await pool.query(
      "SELECT description FROM todo WHERE todo_id=$1",
      [req.params.id]
    );
    if (todo.rows.length == 0) res.json("Invalid ID");
    else res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//delete a todo

app.delete("/todos/:id", async (req, res) => {
  try {
    const deleted = await pool.query(
      "DELETE FROM todo WHERE todo_id=$1 RETURNING todo_id",
      [req.params.id]
    );
    if (deleted.rowCount == 0) res.json("Invalid ID");
    else res.json("Deleted succesfully todo");
  } catch (err) {
    console.error(err.message);
  }
});

//update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { description } = req.body;
    const updated = await pool.query(
      "UPDATE todo SET description=$1 WHERE todo_id=$2 RETURNING todo_id",
      [description, req.params.id]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//delete all todo
app.delete("/all", async (req, res) => {
  try {
    const all = await pool.query("TRUNCATE todo");

    res.json(all);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("Server has started");
});
