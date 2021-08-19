const Router = require("express");
const router = new Router();
const { check } = require("express-validator");
const authMiddleware = require("./middleware/authMiddleware");
const controller = require("./leisureController");

router.get("/getProposition", controller.getProposition);
router.get("/posts", controller.getPost);
router.get("/Random", controller.Random);
router.post("/getPage", controller.getPage);
// router.post("/getPage",controller.agePage);
router.post("/newPost", controller.newPost);
router.post("/delete", controller.deletePost);
router.post("/deleteProposition", controller.deleteProposition);
router.post("/addProposition", controller.addProposition);
router.post("/editPost", controller.editPost);
module.exports = router;
