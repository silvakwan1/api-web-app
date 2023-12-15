const express = require("express");
const router = require("./router/router");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const PORT = process.env.PORT || 3100;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(router);

require("./mongoDb");

app.listen(PORT, () => console.log(`servidor rodando na porta ${PORT}`));
