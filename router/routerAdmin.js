const express = require("express");
const routerAdmin = express.Router();
const Image = require("../config/image");
const User = require("../config/config");

routerAdmin.get("/admin-user-img", async (req, res) => {
  try {
    const imagens = await Image.find();
    const images = imagens.length;

    const user = await User.find({}, { _id: 1, name: 1, balance: 1 });

    res.status(200).json({ images, user });
  } catch (error) {
    console.error("Erro ao buscar no banco", error);
    res.status(500).json({ error: "Erro ao buscar no banco" });
  }
});

routerAdmin.delete("/admin/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);

    res.status(200).json({ msg: `usuario deletado com sucesso.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erro ao deletar o usuario" });
  }
});

module.exports = routerAdmin;
