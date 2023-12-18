const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("../config/config");

const routerGet = express.Router();

routerGet.get("/", (req, res) => res.status(200).json({ msg: "opa amigo" }));

// ||| Privete router |||

const checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Acesso negado!" });

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (error) {
    res.status(400).json({
      msg: "Token invalido!",
    });
  }
};

routerGet.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id, "-password");

  if (!user) return res.status(404).json({ msg: "usuario não encontrado" });

  res.status(200).json({ user });
});

routerGet.get("/get-balance/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    res.json({ balance: user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erro ao buscar usuário" });
  }
});

module.exports = routerGet;
