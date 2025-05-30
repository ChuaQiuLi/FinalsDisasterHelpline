const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];


  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    req.userId = decoded.userId;
    next();
  });
};


router.post('/register', async (req, res) => {

  const { username, email, password } = req.body;

  try {
    // Check for existing username or email
    const existingUser = await prisma.User.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already exists' });
      } 
      
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already exists' });
      }

    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.User.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },

    });

    res.json({ message: 'User registered successfully', user});

  } 
  
  catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'An error occurred while registering.' });
  
  }


});

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.User.findUnique({
      where: {
        username,
      },

    });


    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET);

    res.status(200).json({
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
      },

      token,

    });

  } 
  
  catch (error) {
    res.status(500).json({ error: error.message });
  }

};



const getAuthenticatedUser = async (req, res) => {
  try {
    const user = await prisma.User.findUnique({
      where: { user_id: req.userId },

    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
      },
    });
  } 
  
  catch (error) {
    res.status(500).json({ error: error.message });
  }

};

router.post('/login', login);
router.get('/me', verifyToken, getAuthenticatedUser);

module.exports = router;
