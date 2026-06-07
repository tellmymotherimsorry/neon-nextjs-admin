-- Run this SQL against your Neon Postgres database to create required tables and seed state
CREATE TABLE IF NOT EXISTS banned_users (
  username text PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS mod_users (
  username text PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS trigger_state (
  id int PRIMARY KEY CHECK (id = 1),
  triggered boolean NOT NULL
);

INSERT INTO trigger_state (id, triggered) VALUES (1, false) ON CONFLICT DO NOTHING;
