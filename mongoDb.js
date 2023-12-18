const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGODB_URI;

async function connectToMongoDB() {
  try {
    const db = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB conectado com sucesso!");

    // Manipular eventos de desconexão e erro
    mongoose.connection.on("disconnected", () => {
      console.log("Desconectado do MongoDB");
    });

    mongoose.connection.on("error", (error) => {
      console.error("Erro na conexão com o MongoDB:", error);
    });

    // Retornar a instância do MongoDB (opcional)
    return db;
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    throw error; // Rejeitar a promise para que os chamadores possam lidar com o erro
  }
}

module.exports = connectToMongoDB;
