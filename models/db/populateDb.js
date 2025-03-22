const { Client } = require("pg");
const bcrypt = require("bcrypt");
const connectionString = process.argv[2];

if (!connectionString) {
  console.error("❌ Error: Please provide a database connection string.");
  console.error("Usage: node db/populateDb.js <database-url>");
  process.exit(1);
}

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  userid SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL, 
  hashed_password BYTEA NOT NULL, 
  status VARCHAR(255) NOT NULL DEFAULT 'user',  
  icon VARCHAR(255) NOT NULL,
  theme VARCHAR(255) NOT NULL DEFAULT 'darkMode'
);

CREATE TABLE IF NOT EXISTS messages (
  messageid SERIAL PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  title VARCHAR(255) NOT NULL, 
  text VARCHAR(255) NOT NULL, 
  userid INT REFERENCES users(userid)
);
`;

async function main() {
  console.log("🌱 Seeding database...");

  const client = new Client({ connectionString });

  try {
    await client.connect();
    await client.query(SQL);
    console.log("✅ Database schema created!");

    // Add unique constraint if it doesn't exist
    try {
      await client.query(`
        ALTER TABLE users ADD CONSTRAINT username_unique UNIQUE (username);
      `);
      console.log("✅ Added unique constraint on username");
    } catch (err) {
      if (err.code === "42P07") {
        // duplicate_object error code
        console.log("✅ Unique constraint already exists");
      } else {
        throw err;
      }
    }

    const saltRounds = 10;
    const adminPassword = await bcrypt.hash("admin123", saltRounds);
    const userPassword = await bcrypt.hash("user123", saltRounds);
    const memberPassword = await bcrypt.hash("member123", saltRounds);

    const userInsertResult = await client.query(
      `
      INSERT INTO users (username, hashed_password, status, icon, theme)
      VALUES 
        ('admin', $1, 'admin', 'admin.png', 'darkMode'),
        ('user', $2, 'user', 'user.png', 'lightMode'),
        ('member', $3, 'member', 'member.png', 'darkMode')
      ON CONFLICT (username) DO NOTHING
      RETURNING userid;
    `,
      [
        Buffer.from(adminPassword),
        Buffer.from(userPassword),
        Buffer.from(memberPassword),
      ]
    );
    console.log("✅ Sample users created!");
    if (userInsertResult.rows.length > 0) {
      let userIds = userInsertResult.rows.map((row) => row.userid);
      if (userIds.length === 0) {
        const existingUsers = await client.query(
          `SELECT userid FROclassName="cursor-pointer"M users WHERE username IN ('admin', 'user', 'member')`
        );
        userIds = existingUsers.rows.map((row) => row.userid);
      }
      for (const userId of userIds) {
        await client.query(
          `INSERT INTO messages (title, text, userid) 
           VALUES 
            ($1, $2, $3),
            ($4, $5, $3)`,
          [
            `Welcome from user ${userId}`,
            `This is a sample message from user ${userId}`,
            userId,
            `Second message from user ${userId}`,
            `Another sample message from user ${userId}`,
          ]
        );
      }

      console.log("✅ Sample messages created!");
    }
    console.log("✅ Database successfully seeded!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await client.end();
  }
}

main();
