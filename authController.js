const User = require("./models/Users");
const Role = require("./models/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("./config");

const generateAccessToken = (id) => {
  const payload = {
    id,
  };
  return jwt.sign({ payload }, secret, { expiresIn: "24h" });
};
class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка при регистрации", errors });
      }
      const { username, password, email, role } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким именем уже существует" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await User.findOne({ role });
      console.log(userRole);
      const user = new User({
        username,
        password: hashPassword,
        email,
        role: "user",
      });
      await user.save();
      return res.json({ message: "Пользователь успешно зарегистрирован" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error" });
    }
  }

  async login(req, res) {
    try {
      const { username, password, email, role } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ message: `Пользователь ${username} не найден` });
      }

      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: `Введен неверный пароль` });
      }
      const token = generateAccessToken(user._id);
      console.log(user);

      return res.json({ token, role: user.role, id: user._id });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Login error" });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }
  async me(req, res) {
    try {
      // console.log(req.user)
      const { username, password, email, role, id } = req.body;
      const user = await User.findOne({ _id: req.body.id });
      console.log(user);
      res.status(200).send(user);
      return;
    } catch (e) {
      console.log(e);
    }
  }

  async logout(req, res) {
    try {
      const { token } = req.cookies;
      const token = await userService.logout(token);
      res.clearCookie("token");
      return res.json(token);
    } catch {}
  }
}

module.exports = new authController();
