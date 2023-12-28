const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../config/config");

const routerPut = express.Router();

const checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ msg: "Acesso negado! Token não fornecido." });

  try {
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret);

    req.user = decoded;

    if (!req.user.id) {
      throw new Error("ID do usuário não encontrado no token.");
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({
      msg: "Token inválido ou informações do usuário ausentes.",
    });
  }
};

routerPut.put("/auth/update", checkToken, async (req, res) => {
  const { name, email } = req.body;

  if (!email) return res.status(422).json({ msg: "email e obrigatorio" });

  if (!name) return res.status(422).json({ msg: "nome e obrigatorio" });

  try {
    await User.findByIdAndUpdate(req.user.id, { name, email });

    res.status(200).json({ msg: "Informações atualizadas com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erro ao atualizar informações do usuário" });
  }
});

routerPut.put("/auth/update/password", checkToken, async (req, res) => {
  try {
    const { password, newPassword, confirmPassword } = req.body;

    if (!password) {
      return res.status(422).json({ msg: "Senha atual é obrigatória" });
    }

    if (!newPassword || !confirmPassword) {
      return res
        .status(422)
        .json({ msg: "Novo password e confirmação são obrigatórios" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(422)
        .json({ msg: "Novo password e confirmação não coincidem" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(422).json({ msg: "Senha atual incorreta!" });
    }

    const salt = await bcrypt.genSalt(12);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(req.user.id, { password: newPasswordHash });

    res.status(200).json({ msg: "Senha atualizada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erro ao atualizar a senha do usuário" });
  }
});

routerPut.put("/auth/update/balance", checkToken, async (req, res) => {
  const { value } = req.body;

  if (typeof value !== "number" || value < 0) {
    return res.status(422).json({ msg: "Valor de saldo inválido" });
  }

  if (value > 0.008)
    return res.status(422).json({ msg: "Valor de saldo inválido" });

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    const newBalance = user.balance + value;

    await User.findByIdAndUpdate(req.user.id, { balance: newBalance });

    res.status(200).json({ msg: "Saldo atualizado com sucesso" });
  } catch (err) {
    console.error(err);

    res.status(500).json({ msg: "Erro ao processar a solicitação" });
  }
});

module.exports = routerPut;
