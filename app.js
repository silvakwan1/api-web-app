const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectToMongoDB = require("./mongoDb");

const app = express();
const PORT = process.env.PORT || 3100;
connectToMongoDB();

const routerPost = require("./router/routerPost");
const routerPut = require("./router/routerPut");
const routerGet = require("./router/routerGet");

require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());

app.use(routerPost);
app.use(routerPut);
app.use(routerGet);

app.listen(PORT, () => console.log(`servidor rodando na porta ${PORT}`));
