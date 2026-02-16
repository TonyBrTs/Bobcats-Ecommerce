require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
const clientPromise = require('../services/mongodb')
const SECRET_KEY = process.env.JWT_SECRET

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body

  const usernameRegex = /^[a-zA-Z_ áéíóúÁÉÍÓÚñÑ]{3,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d _\-!@#$%^&*(),.?":{}|<>]{8,}$/;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Nombre de usuario, correo electrónico y contraseña son obligatorios' })
  }
  if (!usernameRegex.test(username)) {
    return res.status(400).json({ message: 'Nombre de usuario inválido. Debe tener entre 3 y 50 caracteres y no puede contener caracteres especiales' })
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Correo electrónico inválido' })
  }
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Contraseña inválida. Debe tener al menos 8 caracteres, contener al menos una letra y un número, y no puede contener espacios' })
  }

  try {
    const client = await clientPromise;
    const db = client.db('BobcatsDB');
    const usersCollection = db.collection('users');

    // Check if email or username already exists
    const existingUser = await usersCollection.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario o correo electrónico ya existe' });
    }

    // Get the last user id and increment
    const lastUser = await usersCollection.find().sort({ id: -1 }).limit(1).toArray();
    const newUserId = lastUser.length > 0 ? lastUser[0].id + 1 : 1;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: newUserId,
      username,
      email,
      password: hashedPassword,
    };

    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: 'Usuario registrado exitosamente', user: { id: newUserId, username, email } });
  } catch (error) {
    res.status(500).json({ message: 'Error en la base de datos', error });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña obligatorios' })
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Correo electrónico inválido' })
  }

  try {
    const client = await clientPromise;
    const db = client.db('BobcatsDB');
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '5m' })

    res.json({
      message: 'Login exitoso',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    })
  } catch (error) {
    res.status(500).json({ message: 'Error en la base de datos', error });
  }
})

module.exports = router