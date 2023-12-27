const mongoose = require("mongoose");

const Image = mongoose.model("Imagem", {
  name: String,
  conteudo: Buffer,
  contentType: String,
});

module.exports = Image;
