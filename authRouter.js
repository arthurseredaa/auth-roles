const Router = require("express");
const { check } = require("express-validator");

const controller = require("./authController");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

const router = new Router();

router.post(
  "/registration",
  [
    check("username", "Имя пользователся не может быть пустым").notEmpty(),
    check(
      "password",
      "Пароль должен быть больше 4 и меньше 18 символов"
    ).isLength({
      min: 4,
      max: 18,
    }),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.get("/users", roleMiddleware(["ADMIN"]), controller.users);

module.exports = router;
