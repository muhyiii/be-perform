const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { cloudinary } = require("../middleware/uploadCloudinary");
dotenv.config();

//// IMPORT MODELS
const UserModel = require("../models").dbUsers;

/// FUNCTIONS

/// REGISTER USER
const registerUser = async (req, res) => {
  try {
    let body = req.body;

    body.password = await bcrypt.hashSync(body.password, 10);

    const users = await UserModel.create({
      username: body.username,
      password: body.password,
    });

    res.status(201).json({
      status: "Success",
      messege: "Succesfully register new account",
      data: users.id,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};
//// ADD BIODATA
const registerUserBiodata = async (req, res) => {
  try {
    let body = req.body;
    let { idUser } = req.params;

    // const result = await cloudinary.uploader.upload(body.image, {
    //   folder: "/profile",
    // });
    // return res.send(req.files.image);
    if (req.file?.path === undefined)
      // jika file tidak ada maka akan mengirimkan pesan wajib upload file
      return res.status(422).json({
        status: "Failed",
        message: "No image choosen",
      }); //  jika status 200 maka akan menampilkan pesan error yang terjadi  dan mengirimkan pesan wajib upload file
    body.image = req.file.path; // jika file ada maka akan mengirimkan foto_barang yang baru

    // return res.send(req.body);
    const dataUser = await UserModel.update(
      {
        name: body.name,
        role: body.role,
        position: body.position,
        birthday: body.birthday,
        image: body.image,
      },
      {
        where: {
          id: idUser,
        },
      }
    );
    const token = jwt.sign(
      {
        id: idUser,
        username: dataUser.username,
        name: body.name,
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: "1w",
      }
    );
    res.status(201).json({
      status: "Success",
      messege: "Succesfully register new account",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};

//// LOGIN USERS
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // CEK EMAIL DULU ADAA ATAU NGGAK
    const users = await UserModel.findOne({
      where: {
        username: username,
      },
    });
    // CEK EMAIL DAN PASSWORD HARUS SAMA DARI DATABASE
    // CEK EMAILNYA
    if (users === null) {
      return res.status(401).json({
        status: "Failed",
        messege: "Your data has not been registered",
      });
    }
    // CEK PASSWORDNYA
    const verify = bcrypt.compareSync(password, users.password);
    if (!verify) {
      return res.status(401).json({
        status: "Gagal",
        messege: "Password is wrong",
      });
    }

    const token = jwt.sign(
      {
        id: users.id,
        username: users.username,
        nama: users.name,
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: "1w",
      }
    );
    res.status(200).json({
      status: "Success",
      messege: "Succesfully logged in",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};

/// GET USERS
const getAllUsers = async (req, res) => {
  try {
    const dataUser = await UserModel.findAll({
      attributes: [
        "id",
        "username",
        "name",
        "role",
        "position",
        "birthday",
        "image",
      ],
    });

    return res.json({
      status: "Success",
      messege: "Succesfully fetching all users data",
      data: dataUser,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await UserModel.findByPk(id, {
      attributes: [
        "id",
        "username",
        "name",
        "role",
        "position",
        "birthday",
        "image",
      ],
    });

    return res.json({
      status: "Success",
      messege: "Succesfully fetching  user data",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Failed",
      messege: `Something is error at ${error}`,
    });
  }
};
module.exports = {
  registerUser,
  getAllUsers,
  loginUser,
  getUserById,
  registerUserBiodata,
};
