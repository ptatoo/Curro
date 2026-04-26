require('dotenv').config();
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Users } = require('./db.js'); // Updated to use the DAO

const app = express();
app.use(cors());
app.use(express.json());

const oAuth2ClientWeb = new OAuth2Client(
  process.env.CLIENT_ID, 
  process.env.CLIENT_SECRET
);

// --- Middleware ---
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.userId = decoded.userId; 
    next();
  });
};

const getJWTToken = (userId) => {
  const sessionToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const { exp } = jwt.verify(sessionToken, process.env.JWT_SECRET);
  return { sessionToken, expiryDate: exp }; // exp is in seconds
};

// ----- route thing -----
const useRoute = (handler) => async (req, res, next) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error(`Error in ${req.method} ${req.originalUrl}:`, error.message);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

// --- Routes ---
app.post('/api/google-exchange', useRoute(async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  const { tokens } = await oAuth2ClientWeb.getToken(code);
  const ticket = await oAuth2ClientWeb.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.CLIENT_ID,
  });

  const { sub: googleId, email, name } = ticket.getPayload();

  const existingUser = Users.getById(googleId);
  if (!existingUser) {
    Users.create({ id: googleId, googleId, email, name });
  }

  const sessionData = getJWTToken(googleId);
  res.status(200).json(sessionData);
}));

app.post('/api/test-get-jwt', authenticate, useRoute(async (req, res) => {
  console.log(req.userId);
  res.status(200).json(req.userId);
}));    

app.post('/api/google-exchange', useRoute(async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  const { tokens } = await oAuth2ClientWeb.getToken(code);
  const ticket = await oAuth2ClientWeb.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.CLIENT_ID,
  });

  const { sub: googleId, email, name } = ticket.getPayload();

  const existingUser = Users.getById(googleId);
  if (!existingUser) {
    Users.create({ id: googleId, googleId, email, name });
  }

  const sessionData = getJWTToken(googleId);
  res.status(200).json(sessionData);
}));



//TESTESTSETSETSETSETSETSETSETSSETSETSETSETAETSETSETAETSETSETAETSETSETAETSETSETAETSETSETAETSETSETA
app.get('/test-auth', authenticate, useRoute(async (req, res) => {
  console.log(req.userId);
  res.status(200).json({ success: true, message: "JWT is valid", user: req.userId });
}));

app.get('/test', useRoute(async (req, res) => {
  console.log(req.userId);
  res.status(200).json({ success: true, message: "valid asf", user: req.userId });
}));
//TESTESTSETSETSETSETSETSETSETSSETSETSETSETAETSETSETAETSETSETAETSETSETAETSETSETAETSETSETAETSETSETA



// LISTENNING INGINGINGINGINGIGN IGNGINIGN IGNGIN IGGIGIGINGINGINGINGINGINGINGINGINGIG
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));