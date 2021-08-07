const express = require("express");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/Leisurester-db");
const Post = require("./leisurense");

const app = express();

const bodyParser = require("body-parser");
const User = require("./Users");
const Proposition = require("./proposition");
const leisurense = require("./leisurense");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/getData", (req, res) => {
  Post.find({}, (err, found) => {
    res.json(found);
  });
});

app.post("/postData", async (req, res) => {
  const post = new Post({
    content: req.body.content,
    name: req.body.name,
    category: req.body.category,
    type: req.body.type,
    persons: req.body.persons,
    description: req.body.description,
    file: req.body.file,
  });
  await post.save();
  res.send(post);
});

app.post("/deleteData", async (req, res) => {
  console.log(req.body.id);
  await Post.deleteOne({ _id: req.body.id });
  return res.send("deleted " + req.body.id);
});

app.post("/register", async (req, res) => {
  console.log(req.body.login);
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    login: req.body.login,
    password: req.body.password,
    email: req.body.email,
  });
  await user.save();
  res.send(user.email);
});

app.get("/getUsers", (req, res) => {
  User.find({}, (err, found) => {
    res.json(found);
  });
});

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, found) => {
    if (!found) {
      res.json({ err: "not f" });
      return;
    }
    if (req.body.password !== found.password) {
      res.json({ err: "wrong pass" });
      return;
    }
    res.json({ userId: found._id });
    return (loggedIn = true);
  });
});

app.post("/proposition", async (req, res) => {
  const proposition = new Proposition({
    content: req.body.content,
    name: req.body.name,
    category: req.body.category,
    type: req.body.type,
    description: req.body.description,
  });
  await proposition.save();
  res.send(proposition);
});

app.get("/getProposition", (req, res) => {
  Proposition.find({}, (err, found) => {
    res.json(found);
  });
});

app.get("/getRandom", async (req, res) => {
  let idArray = [];
  let postArray = [];

  await Post.find({}, (err, found) => {
    if (!found) {
      res.status(404).json({ err });
      return;
    } else {
      idArray = found.map((item) => {
        return item._id;
      });
      console.log(idArray);
      return;
    }
  });

  Promise.all(
    getArray(idArray.length - 1).map(async (index) => {
      let data = await getById(idArray[index]);
      console.log(data.name);
      postArray.push({
        name: data.name,
        category: data.category,
        type: data.type,
        description: data.description,
        id: data._id,
        file: data.file,
      });
    })
  ).then(() => {
    res.send([...postArray]);
    return;
  });
});

const getById = async (id) => {
  let data;
  await Post.find({ _id: id }, (err, found) => {
    if (!found) {
      data = null;
    } else {
      data = found[0];
    }
    return;
  });
  if (!data) {
    data = await getById(id);
  }
  return data;
};

const getArray = (max) => {
  min = 0;
  let arr = [];

  for (let i = 0; i < 3; i++) {
    const random = Math.floor(Math.random() * max);
    if (arr.includes(random, [], "")) {
      i--;
      continue;
    }
    arr[i] = random;
  }
  console.log();
  console.log(arr);
  return arr;
};

app.listen(4000, () => {
  console.log("Server has been started");
});
