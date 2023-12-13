const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("../config/config");

const router = express.Router();

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

router.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id, "-password");

  if (!user) return res.status(404).json({ msg: "usuario não encontrado" });

  res.status(200).json({ user });
});

// ||| Publique router |||

router.get("/", (req, res) => res.status(200).send("ola meu amigo"));

class CreateUser {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}

router.post("/auth/register", async (req, res) => {
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

  try {
    await user.save();

    res.status(201).json({ msg: "usuario criado com sucesso" });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "Aconsteceu um erro no servidor, tente novamente mais tarde!",
    });
  }
});

router.post("/auth/login", async (req, res) => {
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

module.exports = router;
