require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 5000;
const User = require("./models/user");
const Todo = require("./models/todo");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(
  "mongodb+srv://test_user:OLqj4gDETCCSAkLy@cluster0.b3uu1y9.mongodb.net/reduxtodo?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.connection.on("connected", () => {
  console.log("connected to db");
});
mongoose.connection.on("error", (err) => {
  console.log("error", err);
});

app.use(express.json());

const requiredLogin = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json({ error: "you must be loged in" });
  }
  try {
    const { userId } = jwt.verify(authorization, JWT_SECRET);
    req.user = userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "you must be loged in" });
  }
};

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({ error: "please add all the fields" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(422)
        .json({ error: "user already exists with that email" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    new User({
      email,
      password: hashedPassword,
    }).save();

    res.status(201).json({ message: `user created with this ${email}` });
  } catch (err) {
    console.log(err);
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(422).json({ error: "please add all the fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(422)
        .json({ error: "user doest exists with that email" });
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET);
      res.status(201).json({ token });
    } else {
      return res.status(401).json({ error: "email or password is invalid" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/test", requiredLogin, (req, res) => {
  res.json({ message: req.user });
});

app.post("/createtodo", requiredLogin, async (req, res) => {
  const data = await new Todo({
    todo: req.body.todo,
    todoBy: req.user,
  }).save();
  res.status(201).json({ message: data });
});

app.get("/gettodos", requiredLogin, async (req, res) => {
  const data = await Todo.find({
    todoBy: req.user,
  });
  res.status(200).json({ message: data });
});

app.delete("/remove/:id", requiredLogin, async (req, res) => {
  try {
    const removedTodo = await Todo.findOneAndRemove({ _id: req.params.id });
    res.status(200).json({ message: removedTodo });
  } catch (err) {
    console.log(err);
  }
});

// if (process.env.DEPLOYMENT == "production") {
//   const path = require("path");

//   app.get("/", (req, res) => {
//     app.use(express.static(path.resolve(__dirname, "client", "build")));
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

app.listen(PORT, () => {
  console.log(`Server is started at port: ${PORT}`);
});
