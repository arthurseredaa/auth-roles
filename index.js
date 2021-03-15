const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./authRouter");
const { DB_URI } = require("./config");

const PORT = 5000;
const app = express();

app.use(express.json());
app.use("/auth", authRouter);

const init = async () => {
  try {
    await mongoose.connect(
      DB_URI,
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
    );
    app.listen(PORT, () =>
      console.log(`Server started at http://localhost:${PORT}`)
    );
  } catch (error) {
    console.log("Conenction error, ", error);
  }
};

init();
