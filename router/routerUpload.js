const express = require("express");
const routerUpload = express.Router();
const Imagem = require("../config/image");
const upload = require("../config/multer");

routerUpload.post("/upload", upload.single("imagem"), async (req, res) => {
  const { originalname, buffer, mimetype } = req.file;

  try {
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

routerUpload.get("/visualizar/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const imagem = await Imagem.findById(id);

    if (!imagem) {
      return res.status(404).send("Imagem não encontrada.");
    }

    res.set("Content-Type", imagem.contentType);

    res.send(imagem.conteudo);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar imagem.");
  }
});

routerUpload.get("/imagens", async (req, res) => {
  try {
    const imagens = await Imagem.find({}, "nome _id");

    res.json(imagens);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar imagens.");
  }
});

routerUpload.get("/imagens-aleatorias", async (req, res) => {
  try {
    const imagens = await Imagem.aggregate([{ $sample: { size: 10 } }]);

    res.json(imagens);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar imagens aleatórias.");
  }
});

module.exports = routerUpload;
