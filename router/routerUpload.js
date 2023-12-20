const express = require("express");
const routerUpload = express.Router();
const Imagem = require("../config/image");
const upload = require("../config/multer");

routerUpload.post("/upload", upload.single("imagem"), async (req, res) => {
  const { originalname, buffer, mimetype } = req.file;

  try {
    // Salvar a imagem no MongoDB
    const imagem = new Imagem({
      nome: originalname,
      conteudo: buffer,
      contentType: mimetype,
    });

    await imagem.save();

    res.status(201).send("Upload de imagem realizado com sucesso!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro no upload de imagem.");
  }
});

// Rota para visualizar imagem
routerUpload.get("/visualizar/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Buscar a imagem no MongoDB pelo ID
    const imagem = await Imagem.findById(id);

    if (!imagem) {
      return res.status(404).send("Imagem não encontrada.");
    }

    // Configurar o cabeçalho para indicar o tipo de conteúdo da resposta
    res.set("Content-Type", imagem.contentType);
    // Enviar o conteúdo da imagem como resposta
    res.send(imagem.conteudo);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar imagem.");
  }
});

// Rota para obter todas as imagens
routerUpload.get("/imagens", async (req, res) => {
  try {
    // Buscar todas as imagens no MongoDB
    const imagens = await Imagem.find({}, "nome _id");

    res.json(imagens);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar imagens.");
  }
});

// Rota para obter 5 imagens aleatórias
routerUpload.get("/imagens-aleatorias", async (req, res) => {
  try {
    // Buscar 5 imagens aleatórias no MongoDB
    const imagens = await Imagem.aggregate([
      { $sample: { size: 5 } }, // Seleciona aleatoriamente 5 documentos
    ]);

    res.json(imagens);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar imagens aleatórias.");
  }
});

module.exports = routerUpload;
