const express = require("express");
const mongoose = require("mongoose");
const todoRoutes = require("./routes/todos");
const app = express();

app.use(express.json());
app.use("/api/todo", todoRoutes);

/**
 * Database
 */

mongoose
  .connect(
    "mongodb://dbtask:dbtask1234@ds115353.mlab.com:15353/todonode",
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected!!"))
  .catch(err => console.log("Error-----------", err));

/**
 * PORT
 */
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
