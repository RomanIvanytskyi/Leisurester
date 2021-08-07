const express = require("express")
const Leisure = require("./models/leisure") // new
const router = express.Router()

// Get all posts
router.get("/leisures", async (req, res) => {
	const leisure = await Leisure.find()
	res.send(leisure)
})

module.exports = router

const express = require("express")
const router = express.Router()

module.exports = router


router.post("/leisure", async (req, res) => {
    const post = new Leisure({
      title: req.body.title,
      content: req.body.content,
      name: req.body.name,
      category: req.body.category,
      type: req.body.type,
      persons: req.body.persons,
      discription: req.body.discription,
      file: req.body.file,
    });
    await leisure.save();
    res.send(leisure);
  });