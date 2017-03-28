DROP DATABASE IF EXISTS todos;
CREATE DATABASE todos;

\c todos;

CREATE TABLE items (
  ID SERIAL PRIMARY KEY,
  position INTEGER,
  item VARCHAR,
  dotime INTEGER,
  done BOOLEAN
);

INSERT INTO items (item, dotime, done)
  VALUES ('Create to-do list', 1080, false);
