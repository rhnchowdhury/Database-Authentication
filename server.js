const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
var encrypt = require("mongoose-encryption");
const userModel = require("./models/user.model");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongodb connection
const dbURL = process.env.MONGODB_URL;
mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// user created
app.post("/register", async (req, res) => {
  try {
    const newUser = new userModel(req.body);
    await newUser.save();
    res.send(newUser);
  } catch (error) {
    res.json(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (user && user.password === password) {
      res.json({ message: "user found" });
    } else {
      res.json({ message: "user not found" });
    }
  } catch (error) {
    res.json(error.message);
  }
});

// route not found error
app.use((req, res, next) => {
  res.send("Route not found");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
