const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userModel = require("./models/user.model");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;
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
    // const newUser = new userModel(req.body);
    //! Hashing password
    // const newUser = new userModel({
    // name: req.body.name,
    //   email: req.body.email,
    //   password: md5(req.body.email),
    // });
    //! Hashing & salting password
    bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
      const newUser = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });
      await newUser.save();
      res.send(newUser);
    });
    // await newUser.save();
    // res.send(newUser);
  } catch (error) {
    res.json(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    // const { email, password } = req.body;
    // const user = await userModel.findOne({ email: email });
    //! Hashing password
    // const email = req.body.email;
    // const password = md5(req.body.email);
    // const user = await userModel.findOne({ email: email });
    // if (user && user.password === password) {
    //! Hashing & salting password
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result == true) {
          res.json({ message: "user found" });
        }
      });
      // res.json({ message: "user found" });
    } else {
      res.json({ message: "user not found" });
    }
  } catch (error) {
    res.json(error.message);
  }
});

// user get
app.get("/user", async (req, res) => {
  const user = await userModel.find();
  res.send(user);
});

// route not found error
app.use((req, res, next) => {
  res.send("Route not found");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
