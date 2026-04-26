const sqlite = require('better-sqlite3');
const db = new sqlite('data/appDb.db');

db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS userInfo (
    uid INTEGER PRIMARY KEY NOT NULL, 
    googleId TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    minDistance REAL DEFAULT 0,
    maxDistance REAL DEFAULT 0,
    minPace REAL DEFAULT 0,
    maxPace REAL DEFAULT 0,
    location TEXT DEFAULT NULL
  );

  CREATE TABLE IF NOT EXISTS routes (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    start_coord TEXT NOT NULL,
    end_coord TEXT NOT NULL,
    distance REAL
  );

  CREATE TABLE IF NOT EXISTS lobbies (
    id INTEGER PRIMARY KEY,
    creator_id INTEGER NOT NULL,
    route_id INTEGER NOT NULL,
    start_time DATETIME NOT NULL,
    max_players INTEGER,
    target_pace REAL,
    is_private BOOLEAN,
    status TEXT,
    FOREIGN KEY (creator_id) REFERENCES userInfo(uid),
    FOREIGN KEY (route_id) REFERENCES routes(id)
  );

  CREATE TABLE IF NOT EXISTS lobby_members (
    lobby_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (lobby_id, user_id),
    FOREIGN KEY (lobby_id) REFERENCES lobbies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES userInfo(uid) ON DELETE CASCADE
  );
`);

const Users = {
  create: (user) => db.prepare(`INSERT INTO userInfo (uid, googleId, email, name) VALUES (@uid, @googleId, @email, @name)`).run(user),
  getById: (uid) => db.prepare(`SELECT * FROM userInfo WHERE uid = ?`).get(uid),
  updateSettings: (data) => db.prepare(`UPDATE userInfo SET location = @location, minDistance = @minDistance, maxDistance = @maxDistance, minPace = @minPace, maxPace = @maxPace WHERE uid = @uid`).run(data)
};

const Routes = {
  create: (route) => db.prepare(`INSERT INTO routes (id, name, start_coord, end_coord, distance) VALUES (@id, @name, @start_coord, @end_coord, @distance)`).run(route),
  getAll: () => db.prepare(`SELECT * FROM routes`).all(),
};

const Lobbies = {
  create: (lobby) => db.prepare(`INSERT INTO lobbies (id, creator_id, route_id, start_time, max_players, target_pace, is_private, status) VALUES (@id, @creator_id, @route_id, @start_time, @max_players, @target_pace, @is_private, @status)`).run(lobby),
  getPublic: () => db.prepare(`SELECT l.*, r.name as route_name, r.distance, (SELECT COUNT(*) FROM lobby_members m WHERE m.lobby_id = l.id) as current_players FROM lobbies l JOIN routes r ON l.route_id = r.id WHERE l.is_private = 0 AND l.status = 'open'`).all(),
  getMembers: (lobbyId) => db.prepare(`SELECT u.uid as id, u.name FROM lobby_members m JOIN userInfo u ON m.user_id = u.uid WHERE m.lobby_id = ?`).all(),
  getByUser: (userId) => db.prepare(`SELECT l.*, r.name as route_name, r.distance FROM lobbies l JOIN lobby_members m ON l.id = m.lobby_id JOIN routes r ON l.route_id = r.id WHERE m.user_id = ?`).all(),
  join: (lobbyId, userId) => db.prepare(`INSERT OR IGNORE INTO lobby_members (lobby_id, user_id) VALUES (?, ?)`).run(lobbyId, userId),
  leave: (lobbyId, userId) => db.prepare(`DELETE FROM lobby_members WHERE lobby_id = ? AND user_id = ?`).run(lobbyId, userId)
};

const Test = { getData: (tableName) => db.prepare(`SELECT * FROM ${tableName}`).all() };

module.exports = { Test, Users, Routes, Lobbies };