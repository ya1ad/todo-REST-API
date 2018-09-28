const express = require("express");
const { todoModel, validate } = require("../model/todo");
const router = express.Router();

router.get("/", async (req, res) => {
  const getTodos = await todoModel
    .find()
    .sort("createAt")
    .select("-__v")
    .select("-_id");
  try {
    res.send(getTodos);
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

module.exports = router;
