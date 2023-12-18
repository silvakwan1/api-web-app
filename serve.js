const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectToMongoDB = require("./mongoDb");

const routerPost = require("./router/routerPost");
const routerGet = require("./router/routerGet");
const routerPut = require("./router/routerPut");

require("dotenv").config();
// connectToMongoDB();

const PORT = process.env.PORT || 3100;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(routerPost);
app.use(routerPut);
app.use(routerGet);

app.listen(PORT, () => console.log(`servidor rodando na porta ${PORT}`));
