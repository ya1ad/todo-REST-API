const express = require("express");
const { todoModel, validate } = require("../model/todo");
const { loggedInOnly } = require("./auth");
const router = express.Router();

router.get("/", async (req, res) => {
  const getTodos = await todoModel
    .find()
    .sort("createAt")
    .select("-__v");
  try {
    res.render("todoList", { getTodos });
  } catch (ex) {
    res.status(400).send("There is something problem!!");
  }
});

router.post("/", async (req, res) => {
  let { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let data = new todoModel({
    name: req.body.name
  });

  try {
    let saveData = await data.save();
    res
      .status(200)
      .send(saveData)
      .select("-__v");
  } catch (ex) {
    return res.status(400).send("There is something problem!!");
  }
});

router.put("/:id", loggedInOnly, async (req, res) => {
  let { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const get_todo = await todoModel.findById(req.params.id);
  if (!get_todo) res.status(400).send("Invalid update request");

  if (req.body.isCompleted) {
    try {
      const updatedTodo = await todoModel.findByIdAndUpdate(
        req.params.id,
        {
          isCompleted: req.body.isCompleted,
          completedAt: Date()
        },
        { new: true }
      );
      await updatedTodo.save();
      return res.send("Saved!!");
    } catch (ex) {
      console.log(ex);
      return res.send("Operation not sucessful.");
    }
  }

  try {
    await updateData.save();
    return res.send("Saved!!");
  } catch (ex) {
    return res.send("Operation not sucessful. -1");
  }
});

router.delete("/:id", loggedInOnly, async (req, res) => {
  const get_todo = await todoModel.findOneAndDelete(req.params._id);

  if (!get_todo) return res.status(404).send("Invalid request");

  res.send(get_todo);
});

router.get("/:id", loggedInOnly, async (req, res) => {
  let { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const get_todo = await todoModel.findById(req.params.id);
  if (!get_todo) res.status(400).send("Invalid update request");

  res.render("todo", { get_todo });
});

module.exports = router;
