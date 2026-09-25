CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  pass_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'free',
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
CREATE TABLE IF NOT EXISTS subscribers (
  email TEXT PRIMARY KEY,
  source TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS waitlist (
  user_id INTEGER NOT NULL,
  plan TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, plan)
);
CREATE TABLE IF NOT EXISTS login_failures (
  email TEXT NOT NULL,
  at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS login_failures_email ON login_failures(email, at);
