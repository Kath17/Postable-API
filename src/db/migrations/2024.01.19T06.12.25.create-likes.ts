import { Migration } from "../scripts/dbMigrate";

export const up: Migration = async (params) => {
  params.context.query(`CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    postId INT NOT NULL,
    userId INT NOT NULL,
    createdAt VARCHAR(50) NOT NULL,
    FOREIGN KEY (postId) REFERENCES posts(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);`);
};

export const down: Migration = async (params) => {
  params.context.query(`DROP TABLE likes;`);
};
