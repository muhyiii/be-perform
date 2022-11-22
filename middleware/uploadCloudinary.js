const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_API_KEY,
  secure: true,
}); // untuk mengambil data dari .env file untuk mengambil data dari cloudinary

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "/profile",
  },
}); // untuk mengambil data dari cloudinary dan mengambil data dari folder cupang

const upload = multer({ storage: storage }); // untuk mengambil data dari storage yang sudah dibuat di atas untuk mengambil data dari cloudinary dan mengambil data dari folder cupang
module.exports = { upload };
