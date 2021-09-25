const express = require("express");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/Leisurester-db");
const Post = require("./models/leisurense");
const proposition = require("./models/proposition");
const Proposition = require("./models/proposition");

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
  return arr;
};

class leisureController {
  async getPost(req, res) {
    try {
      Post.find({}, (err, found) => {
        res.json(found);
      });
    } catch (e) {
      return res.send({ err: e });
    }
  }

  async addPage(req, res) {
    try {
      await Post.findOne({ _id: req.body.id });
      return res.send(req.body.id);
    } catch (e) {
      return res.send({ err: e });
    }
  }

  async getPage(req, res) {
    try {
      await Post.findOne({ _id: req.body.id }, (err, found) => {
        res.json(found);
      });
    } catch (e) {
      return res.send({ err: e });
    }
  }

  async newPost(req, res) {
    try {
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
    } catch (e) {
      return res.send({ err: e });
    }
  }
  async deletePost(req, res) {
    try {
      await Post.deleteOne({ _id: req.body.id });
      res.send("deleted " + req.body.id);
    } catch (e) {
      return res.send({ err: e });
    }
  }

  async deleteProposition(req, res) {
    try {
      await proposition.deleteOne({ _id: req.body.id });
      res.send("deleted " + req.body.id);
    } catch (e) {
      return res.send({ err: e });
    }
  }

  async addProposition(req, res) {
    try {
      const proposition = new Proposition({
        // content: req.body.content,
        name: req.body.name,
        category: req.body.category,
        type: req.body.type,
        description: req.body.description,
      });
      await proposition.save();
      res.send(proposition);
    } catch (e) {
      return res.send({ err: e });
    }
  }

  async getProposition(req, res) {
    try {
      Proposition.find({}, (err, found) => {
        res.json(found);
      });
    } catch (e) {
      return res.send({ err: e });
    }
  }

  async editPost(req, res) {
    const updated = await Post.findOneAndUpdate(
      { _id: req.body.id },
      {
        content: req.body.content,
        name: req.body.name,
        category: req.body.category,
        type: req.body.type,
        persons: req.body.persons,
        description: req.body.description,
        file: req.body.file,
      },
      {
        upsert: true,
      }
    )
      .then(() => {
        res.status(201).json({
          message: "Updated successfully!",
        });
      })
      .catch((error) => {
        return res.send({ err: e });
      });
  }

  async postSearch(req, res) {
  
    if (req.body && req.body.name) {
      try {
        Post.find({ name: { $regex: req.body.name } }, (err, found) => {
          found ? res.send({ posts: found }) : res.send({ data: err });
        });
      } catch (e) {
        res.send({ data: e });
      }
    } else {
      try {
        Post.find({}, (err, found) => {
          found ? res.send({ posts: found }) : res.send({ data: err });
        });
      } catch (e) {
        res.send({ data: e });
      }
    }
  }

  async Random(req, res) {
    try {
      let idArray = [];
      let postArray = [];

      await Post.find({}, (err, found) => {
        if (!found) {
          return res.send({ err });
        } else {
          idArray = found.map((item) => {
            return item._id;
          });
          return;
        }
      });

      Promise.all(
        getArray(idArray.length - 1).map(async (index) => {
          let data = await getById(idArray[index]);

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
    } catch (e) {
      res.status(400).json({ message: "error" });
    }
  }
}

module.exports = new leisureController();
