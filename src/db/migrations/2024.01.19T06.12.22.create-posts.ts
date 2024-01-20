import { Migration } from "../scripts/dbMigrate";

export const up: Migration = async (params) => {
  params.context.query(`CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    userId INT NOT NULL,
    content TEXT NOT NULL,
    createdAt VARCHAR(50) NOT NULL,
    updatedAt VARCHAR(50) NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
);`);
};

export const down: Migration = async (params) => {
  params.context.query(`DROP TABLE posts;`);
};
