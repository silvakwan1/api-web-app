const express = require("express");
const routerUpload = express.Router();
const Image = require("../config/image");
const upload = require("../config/multer");

routerUpload.post("/upload", upload.single("image"), async (req, res) => {
  const { originalname, buffer, mimetype } = req.file;

  try {
    const image = new Image({
      nome: originalname,
      conteudo: buffer,
      contentType: mimetype,
    });

    await image.save();

    res.status(201).send("Upload de imagem realizado com sucesso!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro no upload de imagem.");
  }
});

routerUpload.get("/visualizar/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).send("Imagem não encontrada.");
    }

    res.set("Content-Type", image.contentType);

    res.send(image.conteudo);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar imagem.");
  }
});

routerUpload.get("/imagens", async (req, res) => {
  try {
    const imagens = await Image.find({}, "nome _id");

    res.json(imagens);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar imagens.");
  }
});

routerUpload.get("/imagens-aleatorias", async (req, res) => {
  try {
    const imagens = await Image.aggregate([{ $sample: { size: 10 } }]);

    res.json(imagens);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar imagens aleatórias.");
  }
});

module.exports = routerUpload;
