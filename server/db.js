const sqlite = require('better-sqlite3');
const db = new sqlite('data/appDb.db');

db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS userInfo (
    id TEXT PRIMARY KEY NOT NULL,
    googleId TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    bio TEXT DEFAULT 's',
    location TEXT,
    pace_avg REAL DEFAULT -1,
    dist_pref REAL DEFAULT -1,
    total_runs INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS routes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    start_coord TEXT NOT NULL,
    end_coord TEXT NOT NULL,
    distance REAL,
    map_polyline TEXT
  );

  CREATE TABLE IF NOT EXISTS lobbies (
    id TEXT PRIMARY KEY,
    creator_id TEXT NOT NULL,
    route_id TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    max_players INTEGER,
    target_pace REAL,
    is_private BOOLEAN,
    status TEXT,
    FOREIGN KEY (creator_id) REFERENCES userInfo(id),
    FOREIGN KEY (route_id) REFERENCES routes(id)
  );

  CREATE TABLE IF NOT EXISTS lobby_members (
    lobby_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    PRIMARY KEY (lobby_id, user_id),
    FOREIGN KEY (lobby_id) REFERENCES lobbies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES userInfo(id) ON DELETE CASCADE
  );
`);

const Users = {
  create: (user) => db.prepare(`INSERT INTO userInfo (id, googleId, email, name) VALUES (@id, @googleId, @email, @name)`).run(user),
  getById: (id) => db.prepare(`SELECT * FROM userInfo WHERE id = ?`).get(id),
  updateProfile: (data) => db.prepare(`UPDATE userInfo SET bio = @bio, pace_avg = @pace_avg, dist_pref = @dist_pref WHERE id = @id`).run(data),
  updateSettings: (data) => db.prepare(`UPDATE userInfo SET location = @location, pace_avg = @pace_avg, dist_pref = @dist_pref WHERE id = @id`).run(data)
};

const Routes = {
  create: (route) => db.prepare(`INSERT INTO routes (id, name, start_coord, end_coord, distance) VALUES (@id, @name, @start_coord, @end_coord, @distance)`).run(route),
  getAll: () => db.prepare(`SELECT * FROM routes`).all(),
};

const Lobbies = {
  create: (lobby) => db.prepare(`INSERT INTO lobbies (id, creator_id, route_id, start_time, max_players, target_pace, is_private) VALUES (@id, @creator_id, @route_id, @start_time, @max_players, @target_pace, @is_private)`).run(lobby),
  getPublic: () => db.prepare(`SELECT l.*, r.name as route_name, r.distance, (SELECT COUNT(*) FROM lobby_members m WHERE m.lobby_id = l.id) as current_players FROM lobbies l JOIN routes r ON l.route_id = r.id WHERE l.is_private = 0 AND l.status = 'open'`).all(),
  getMembers: (lobbyId) => db.prepare(`SELECT u.id, u.name FROM lobby_members m JOIN userInfo u ON m.user_id = u.id WHERE m.lobby_id = ?`).all(),
  getByUser: (userId) => db.prepare(`SELECT l.*, r.name as route_name, r.distance FROM lobbies l JOIN lobby_members m ON l.id = m.lobby_id JOIN routes r ON l.route_id = r.id WHERE m.user_id = ?`).all(),
  join: (lobbyId, userId) => db.prepare(`INSERT INTO lobby_members (lobby_id, user_id) VALUES (?, ?)`).run(lobbyId, userId),
  leave: (lobbyId, userId) => db.prepare(`DELETE FROM lobby_members WHERE lobby_id = ? AND user_id = ?`).run(lobbyId, userId)
};

module.exports = { Users, Routes, Lobbies };