CREATE DATABASE pern_boilerplate;

-- \c pern_boilerplate

CREATE TABLE todo(
    todo_id SERIAL PRIMARY KEY,
    description VARCHAR(255)
);
