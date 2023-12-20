const mongoose = require("mongoose");

const Imagem = mongoose.model("Imagem", {
  nome: String,
  conteudo: Buffer,
  contentType: String,
});

module.exports = Imagem;
