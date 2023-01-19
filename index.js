const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes/route");
const port = process.env.PORT || 2100;

app.use(cors());
app.use(express.json());
app.use(router);
app.listen(port, () => {
  console.log(`Is being online at port ${port}`);
});
  