const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config");

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") next();
    try {
      // "Bearer" word - 0, token - 1
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(403).json({ message: "Пользователь не авторизован" });
      }
      const { roles: userRoles } = jwt.verify(token, JWT_SECRET);

      let isValidRoles = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) isValidRoles = true;
      });

      if (!isValidRoles) {
        return res.status(403).json({ message: "У вас нет доступа!" });
      }
      next();
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Пользователь не авторизован" });
    }
  };
};
