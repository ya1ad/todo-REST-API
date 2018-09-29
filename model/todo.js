const joi = require("joi");
const mongo = require("mongoose");

const todoSchema = new mongo.Schema({
  name: { type: String, maxlength: 255, minlength: 5, required: true },
  createAt: { type: Date, default: Date.now, required: true },
  isCompleted: { type: Boolean, required: true, default: false },
  completedAt: { type: Date }
});

const todoModel = mongo.model("Tasks", todoSchema);

function validate(todo) {
  const schema = {
    name: joi
      .string()
      .min(5)
      .max(255),
    isCompleted: joi.boolean()
  };
  return joi.validate(todo, schema);
}

module.exports.validate = validate;
module.exports.todoModel = todoModel;
