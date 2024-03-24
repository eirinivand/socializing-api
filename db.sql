DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS chat_users;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS chats;

CREATE TABLE users
(
    id       INT PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    surname  VARCHAR(255) NOT NULL,
    birthday DATE         NOT NULL,
    gender   VARCHAR(30),
    username VARCHAR(30)  NOT NULL UNIQUE
);

CREATE TABLE chats
(
    id SERIAL PRIMARY KEY
);

CREATE TABLE chat_users
(
    id      SERIAL PRIMARY KEY,
    chat_id INT NOT NULL,
    user_id INT NOT NULL,
    CONSTRAINT fk_chat
        FOREIGN KEY (chat_id)
            REFERENCES chats (id),
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
            REFERENCES users (id),
    UNIQUE (chat_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_user ON chat_users (user_id);
--  TODO think if I need all different indexes

CREATE TABLE messages
(
    id      INT PRIMARY KEY,
    content TEXT      NOT NULL,
    chat_id INT       NOT NULL,
    from_id INT       NOT NULL,
    is_seen BOOLEAN   NOT NULL DEFAULT FALSE,
    sent_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_chat
        FOREIGN KEY (chat_id)
            REFERENCES chats (id),
    CONSTRAINT fk_user
        FOREIGN KEY (from_id)
            REFERENCES users (id)
);

CREATE INDEX IF NOT EXISTS idx_chat ON messages (chat_id);
