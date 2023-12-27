const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("../config/config");

const routerPost = express.Router();

class CreateUser {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
routerPost.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  if (!name) return res.status(422).json({ msg: "name e obrigatorio" });

  if (!email) return res.status(422).json({ msg: "email e obrigatorio" });

  if (!password) return res.status(422).json({ msg: "password e obrigatorio" });

  if (confirmpassword !== password)
    return res
      .status(422)
      .json({ msg: "password é confirmpassword incompativel" });

  const userExists = await User.findOne({ email: email });

  if (userExists) return res.status(422).json({ msg: "email já cadastrado" });

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const createUser = new CreateUser(name, email, passwordHash);

  const user = new User(createUser);
  user.balance = 0;

  try {
    await user.save();

    res.status(201).json({ msg: "Usuário criado com sucesso" });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde!s",
    });
  }
});

routerPost.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(422).json({ msg: "email e obrigatorio" });

  if (!password) return res.status(422).json({ msg: "password e obrigatorio" });

  const user = await User.findOne({ email: email });

  if (!user) return res.status(404).json({ msg: "usuario não encontrado" });

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) return res.status(422).json({ msg: "senha invalida!" });

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );
    const id = user._id;
    res.status(200).json({ msg: "usuario logado com sucesso", token, id });
  } catch (err) {
    console.log(err);

    res.status(404).json({
      msg: "usuario não encontrado",
    });
  }
});

module.exports = routerPost;
