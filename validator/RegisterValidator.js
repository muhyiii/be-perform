const { check } = require("express-validator");
const UserModel = require("../models").dbUsers;

const userValidator = [
  // check("name").isLength({ min: 1 }).withMessage("Nama Wajib Diisi"),
  check("username").custom((value) => {
    return UserModel.findOne({ where: { username: value } }).then((user) => {
      if (user) {
        return Promise.reject("Username Telah Digunakan");
      }
    });
  }),
];

module.exports = { userValidator };
