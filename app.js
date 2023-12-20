const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3100;
require("./mongoDb");

const routerPost = require("./router/routerPost");
const routerPut = require("./router/routerPut");
const routerGet = require("./router/routerGet");
const routerUpload = require("./router/routerUpload");

app.use(cors());
app.use(bodyParser.json());

app.use(routerPost);
app.use(routerPut);
app.use(routerGet);
app.use(routerUpload);

app.listen(PORT, () => console.log(`servidor rodando na porta ${PORT}`));
