const pool = require("./pool");
const bcrypt = require("bcrypt");

async function seedDatabase() {
  try {
    console.log("Checking database structure...");
    const createTablesSQL = `
      CREATE TABLE IF NOT EXISTS users (
        userid SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE, 
        hashed_password BYTEA NOT NULL, 
        status VARCHAR(255) NOT NULL DEFAULT 'user',  
        icon VARCHAR(255) NOT NULL,
        theme VARCHAR(255) NOT NULL DEFAULT 'dark'
      );
      
      CREATE TABLE IF NOT EXISTS messages (
        messageid SERIAL PRIMARY KEY,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        title VARCHAR(255) NOT NULL, 
        text VARCHAR(255) NOT NULL, 
        userid INT REFERENCES users(userid)
      );
    `;
    await pool.query(createTablesSQL);
    console.log("Database tables created or verified");
    
    const userCheck = await pool.query("SELECT COUNT(*) FROM users");

    if (parseInt(userCheck.rows[0].count) === 0) {
      console.log("Seeding empty database with data...");

      const saltRounds = 10;
      const adminPassword = await bcrypt.hash("admin123", saltRounds);
      const userPassword = await bcrypt.hash("user123", saltRounds);
      const memberPassword = await bcrypt.hash("member123", saltRounds);
      
      const insertUsersSQL = `
        INSERT INTO users (username, hashed_password, status, icon, theme)
        VALUES
          ('admin', $1, 'admin', 'https://avatarfiles.alphacoders.com/375/thumb-1920-375280.jpeg', 'dark'),
          ('user', $2, 'user', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvX4fFWzffd0uGJU6KSk5z-PSR9u4AwAb14A&s', 'light'),
          ('member', $3, 'member', 'https://i.pinimg.com/736x/a9/ec/eb/a9ecebd674761e161c87a834fe04f59d.jpg', 'dark')
        ON CONFLICT (username) DO NOTHING
        RETURNING userid;
      `;

      const userResult = await pool.query(insertUsersSQL, [
        Buffer.from(adminPassword),
        Buffer.from(userPassword),
        Buffer.from(memberPassword)
      ]);
      console.log("Sample users created!");

      if (userResult.rows.length > 0) {
        for (const user of userResult.rows) {
          await pool.query(
            `INSERT INTO messages (title, text, userid) 
             VALUES 
              ($1, $2, $3),
              ($4, $5, $3)`,
            [
              `Welcome from ${user.username}`,
              `This is a sample letter from ${user.username}. Thank you for reading!`,
              user.userid,
              `Second letter from ${user.username}`,
              `Another sample letter from ${user.username}. The application supports viewing and writing letters.`,
            ]
          );
        }
        console.log("Sample messages created!");
      } else {
        const existingUsers = await pool.query(
          `SELECT userid FROM users WHERE username IN ('admin', 'user', 'member') LIMIT 3`
        );

        const messageCheck = await pool.query("SELECT COUNT(*) FROM messages");
        
        if (parseInt(messageCheck.rows[0].count) === 0 && existingUsers.rows.length > 0) {
          for (const user of existingUsers.rows) {
            await pool.query(
              `INSERT INTO messages (title, text, userid) 
               VALUES 
                ($1, $2, $3),
                ($4, $5, $3)`,
              [
                `Welcome from user ${user.userid}`,
                `This is a sample letter from existing user. Thank you for reading!`,
                user.userid,
                `Second letter from user ${user.userid}`,
                `Another sample letter from existing user. The application supports viewing and writing letters.`,
              ]
            );
          }
          console.log("Sample messages created for existing users!");
        }
      }

      console.log("Database seeded successfully");
    } else {
      console.log("Database already contains data, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

module.exports = seedDatabase;