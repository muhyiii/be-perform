const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const ModelUser = require("../models").tb_user;

async function adminMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      status: "Gagal",
      messege: "Anda Tidak Terdaftar",
    });
  }
  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "Gagal",
        messege: "Token Tidak Valid",
        data: err,
      });
    } else {
      const user = await ModelUser.findOne({
        where: {
          username: decoded?.username,
          role: decoded?.role,
        },
      });
      if (!user)
        return res.status(422).json({
          status: "Gagal",
          messege: "User Telah Dihapus",
        });
      console.log(decoded);
      (req.id_outlet = decoded?.id_outlet), (req.id = decoded?.id);
      req.username = decoded?.username;
      req.role = decoded?.role;
      if (req.role === "admin") {
        next();
      } else {
        return res.status(422).json({
          status: "Gagal",
          messege: "Anda Tidak Bisa Mengakses API Ini",
        });
      }
    }
  });
}
async function kasirMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      status: "Gagal",
      messege: "Anda Tidak Terdaftar",
    });
  }
  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "Gagal",
        messege: "Token Tidak Valid",
        data: err,
      });
    } else {
      const user = await ModelUser.findOne({
        where: {
          username: decoded?.username,
          role: decoded?.role,
        },
      });
      if (!user)
        return res.status(422).json({
          status: "Gagal",
          messege: "User Telah Dihapus",
        });
      (req.id_outlet = decoded?.id_outlet), (req.id = decoded?.id);
      req.username = decoded?.username;
      req.role = decoded?.role;
      if (req.role === "kasir") {
        next();
      } else {
        return res.status(422).json({
          status: "Gagal",
          messege: "Anda Tidak Bisa Mengakses API Ini",
        });
      }
    }
  });
}
async function ownerMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      status: "Gagal",
      messege: "Anda Tidak Terdaftar",
    });
  }
  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "Gagal",
        messege: "Token Tidak Valid",
        data: err,
      });
    } else {
      const user = await ModelUser.findOne({
        where: {
          username: decoded?.username,
          role: decoded?.role,
        },
      });
      if (!user)
        return res.status(422).json({
          status: "Gagal",
          messege: "User Telah Dihapus",
        });

      req.id = decoded?.id;
      (req.id_outlet = decoded?.id_outlet), (req.username = decoded?.username);
      req.role = decoded?.role;
      if (req.role === "owner") {
        next();
      } else {
        return res.status(422).json({
          status: "Gagal",
          messege: "Anda Tidak Bisa Mengakses API Ini",
        });
      }
    }
  });
}

module.exports = { adminMiddleware, kasirMiddleware, ownerMiddleware };
