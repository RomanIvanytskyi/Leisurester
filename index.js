const express = require("express");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/Leisurester-db");
const PORT = process.env.PORT || 4000;
const authRouters = require("./authRouter");
const leisureRouter = require("./leisureRouter");

const app = express();
app.use(express.json());
app.use("/auth", authRouters);
app.use("/leisure", leisureRouter);

const start = () => {
  try {
    app.listen(PORT, () => console.log(`server started ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};
start();
