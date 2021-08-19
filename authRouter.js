const Router = require("express");
const router = new Router();
const { check } = require("express-validator");
const authMiddleware = require("./middleware/authMiddleware");
const controller = require("./authController");

router.post(
  "/registration",
  [
    check("username", "Имя пользователя не может быть пустым").notEmpty(),
    check(
      "password",
      "Пароль должен быть больше 4 и меньше 10 символов"
    ).isLength({ min: 4, max: 10 }),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.get("/users", controller.getUsers);
router.get("/logout", controller.logout);
router.post("/me",controller.me )

module.exports = router;
