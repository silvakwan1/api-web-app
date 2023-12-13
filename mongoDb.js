const mongoose = require("mongoose");
require("dotenv").config();

const DbUser = process.env.DB_User;
const DbPassword = process.env.DB_Password;

async function mongoDb() {
  try {
    await mongoose.connect(
      `mongodb+srv://${DbUser}:${DbPassword}@cluster0.mbalgbn.mongodb.net/?retryWrites=true&w=majority`
    );

    console.log("Mongo conectado com sucesso!");
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
  }
}

module.exports = mongoDb;
