const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const { JWT_SECRET } = require("./config");

const User = require("./models/User");
const Role = require("./models/Role");

const generateAccessToken = (id, roles) => {
  const payload = { id, roles };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

class authControlled {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка при регистрации", errors: errors.errors });
      }

      const { username, password } = req.body;
      const candidate = await User.findOne({ username });

      if (candidate) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким именем уже существует" });
      }

      const hashedPassword = await bcrypt.hashSync(password, 7);
      const role = await Role.findOne({ value: "USER" });
      const user = new User({
        username,
        password: hashedPassword,
        roles: [role.value],
      });
      await user.save();
      return res.json({ message: "Пользователь успешно зарегистрирован" });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json({ message: "Registration error", error: error.message });
    }
  }
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ message: `Пользователь ${username} не найден!` });
      }

      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Неверный пароль!" });
      }

      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Login error", error: error.message });
    }
  }
  async users(req, res) {
    try {
      const users = await User.find();
      return res.json({ users });
    } catch (error) {
      res.status(400).json({ message: "Error in getting users: ", error });
    }
  }
}

module.exports = new authControlled();
