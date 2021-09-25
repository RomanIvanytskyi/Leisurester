const User = require("./models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("./config");

const generateAccessToken = (id) => {
  let payload = {id}
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
  async registration(req, res) {
    try {
      // const errors = validationResult(req); TODO
      // if (errors) {
      //   return res.send({ errors });
      // }
      const { username, password, email, role } = req.body;
      const user = await User.findOne({ username });
      if (user) {
        return res.send({ message: "User already exist" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = new User({
        username,
        password: hashPassword,
        email,
        role: "user",
      });
      await user.save();

      const token = generateAccessToken(user._id);
      return res.json({ token, userId: user._id });
    } catch (e) {
      res.send({ message: "Registration error" });
    }
  }

  async login(req, res) {
    try {
      const { password, email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.send({ message: `Bad credentials` });
      }

      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.send({ message: `Bad credentials` });
      }

      const token = generateAccessToken(user.id);

      return res.json({ token });
    } catch (e) {
      res.send({ message: "Login error" });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.send({ users });
    } catch (e) {
      res.send({ err: e });
    }
  }

  async me(req, res) {
    const userId = await req.user.id;
    console.log(req.user);
    const user = await User.findOne({ _id: userId });
    return res.send(user);
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
