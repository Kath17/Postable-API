import { Migration } from "../scripts/dbMigrate";

export const up: Migration = async (params) => {
  return params.context.query(`CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    role VARCHAR(10) NOT NULL DEFAULT 'user',
    createdAt VARCHAR(50) NOT NULL,
    updatedAt VARCHAR(50) NOT NULL
    CONSTRAINT chk_role CHECK (role IN ('user', 'admin'))
);
`);
};

export const down: Migration = async (params) => {
  params.context.query(`DROP TABLE users;`);
};
