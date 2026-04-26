require('dotenv').config();
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Test, Users, Routes, Lobbies } = require('./db.js');

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;

const oAuth2ClientWeb = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);

// --- Middleware ---
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.userId = decoded.userId; 
    next();
  });
};

const getJWTToken = (userId) => {
  const sessionToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  const { exp } = jwt.verify(sessionToken, JWT_SECRET);
  return { sessionToken, expiryDate: exp }; 
};

const useRoute = (handler) => async (req, res, next) => {
  try {
    await handler(req, res);
  } catch (error) {
    const detail = error.response?.data || error.message;
    console.error(`Detailed Error in ${req.method} ${req.originalUrl}:`, detail);
    res.status(500).json({ error: detail });
  }
};

// --- Auth ---
app.post('/api/auth/google', useRoute(async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  const { tokens } = await oAuth2ClientWeb.getToken({
    code: code,
    redirect_uri: REDIRECT_URI
  });
  
  const ticket = await oAuth2ClientWeb.verifyIdToken({
    idToken: tokens.id_token,
    audience: CLIENT_ID,
  });

  const { sub: googleId, email, name } = ticket.getPayload();

  if (!Users.getById(googleId)) {
    Users.create({ uid: googleId, googleId, email, name });
  }

  res.status(200).json(getJWTToken(googleId));
}));

// --- Users ---
app.get('/api/users/me', authenticate, useRoute(async (req, res) => {
  res.status(200).json(Users.getById(req.userId));
}));

app.put('/api/users/me', authenticate, useRoute(async (req, res) => {
  Users.updateSettings({ ...req.body, uid: req.userId });
  res.status(200).json({ success: true });
}));

/*
// --- Routes ---
app.get('/api/routes', authenticate, useRoute(async (req, res) => {
  res.status(200).json(Routes.getAll());
}));

app.post('/api/routes', authenticate, useRoute(async (req, res) => {
  const id = Date.now().toString(); 
  Routes.create({ ...req.body, id });
  res.status(201).json({ id });
}));
*/ //deprecated untill we get it working

// --- Lobbies ---
app.get('/api/lobbies', authenticate, useRoute(async (req, res) => {
  res.status(200).json(Lobbies.getPublic());
}));

app.get('/api/lobbies/me', authenticate, useRoute(async (req, res) => {
  res.status(200).json(Lobbies.getByUser(req.userId));
}));

app.get('/api/lobbies/:id/members', authenticate, useRoute(async (req, res) => {
  res.status(200).json(Lobbies.getMembers(req.params.id));
}));

app.post('/api/lobbies', authenticate, useRoute(async (req, res) => {
  const id = Date.now().toString();
  Lobbies.create({ ...req.body, id, creator_id: req.userId, status: 'open' });
  Lobbies.join(id, req.userId); // Creator auto-joins
  res.status(201).json({ id });
}));

app.post('/api/lobbies/:id/join', authenticate, useRoute(async (req, res) => {
  Lobbies.join(req.params.id, req.userId);
  res.status(200).json({ success: true });
}));

app.delete('/api/lobbies/:id/leave', authenticate, useRoute(async (req, res) => {
  Lobbies.leave(req.params.id, req.userId);
  res.status(200).json({ success: true });
}));

// --- ULTIMATE TESTER LOL ---
app.get('/TEST', useRoute(async (req, res) => {
  res.status(200).json("URAAZING");
}));

app.get('/TEST', useRoute(async (req, res) => {
  res.status(200).json("URAAZING");
}));

app.get('/getData', (req, res) => {
  const tableName = req.query.tableName; 
  res.send(Test.getData(tableName));
});

// --- Init ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));