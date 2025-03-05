const pool = require("./pool");

async function seedDatabase() {
  try {
    console.log("Checking database structure...");
    const createTablesSQL = `
      CREATE TABLE IF NOT EXISTS categories (
        categoryid SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL, 
        description VARCHAR(255) NOT NULL, 
        imageURL VARCHAR(255) NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS games (
        gameid SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL, 
        price INT NOT NULL, 
        platform VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL, 
        imageURL VARCHAR(255) NOT NULL, 
        categoryid INT REFERENCES categories(categoryid)
      );
    `;
    await pool.query(createTablesSQL);
    console.log("Database tables created or verified");
    const categoryCheck = await pool.query("SELECT COUNT(*) FROM categories");

    if (parseInt(categoryCheck.rows[0].count) === 0) {
      console.log("Seeding empty database with data...");
      const insertCategoriesSQL = `
        INSERT INTO categories (name, description, imageURL)
        VALUES
          ('Horror', 'Games that are creepy and scary', 'https://i.redd.it/zf88ws9jxtmc1.jpeg'),
          ('FPS', 'Games that require shooting and first person view', 'https://www.greenmangaming.com/blog/wp-content/uploads/2020/04/Titanfall-2-Feature-890x606.png'),
          ('Gacha', 'Games which contain some form of gambling for characters or weapons', 'https://pbs.twimg.com/media/GPyKRbEW4AAMlaK?format=jpg&name=large'),
          ('MOBA', 'Games that where you move with a mouse and third person view', 'https://www.esportstalk.com/wp-content/uploads/2020/03/Top-Moba.jpg'),
          ('Souls', 'Games that are open World and many boss fights', 'https://staticg.sportskeeda.com/editor/2024/01/06aa1-17053339798453-1920.jpg')
        ON CONFLICT DO NOTHING;
      `;

      await pool.query(insertCategoriesSQL);
      console.log("Categories data inserted");
      const insertGamesSQL = `
        INSERT INTO games (name, price, platform, description, imageURL, categoryid)
        VALUES
          ('Genshin Impact', 0, 'Cross Platform', 'a Gacha Game that is so trash and addictive and bad', 'https://cdn1.epicgames.com/offer/879b0d8776ab46a59a129983ba78f0ce/genshintall_1200x1600-4a5697be3925e8cb1f59725a9830cafc', 3),
          ('League Of Legend', 0, 'PC', 'A 5V5 Game where u tilt and curse everybody else and alt + F4', 'https://mediaproxy.tvtropes.org/width/1200/https://static.tvtropes.org/pmwiki/pub/images/leagueoflegends.png', 4),
          ('Elden Ring', 60, 'Cross Platform', 'Elden Ring is a 2022 action role-playing game developed by FromSoftware.', 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Elden_Ring_Box_art.jpg/220px-Elden_Ring_Box_art.jpg', 5),
          ('Call of Duty: Black Ops 6', 60, 'Cross Platform', 'Call of Duty: Black Ops 6 is a 2024 first-person shooter video game co-developed by Treyarch and Raven Software and published by Activision.', 'https://upload.wikimedia.org/wikipedia/en/c/c9/Call_of_Duty_Black_Ops_6_Key_Art.png', 2),
          ('Resident Evil 4', 40, 'Cross Platform', 'Resident Evil 4 is a 2005 survival horror game developed and published by Capcom for the GameCube.', 'https://image.api.playstation.com/vulcan/ap/rnd/202210/0706/EVWyZD63pahuh95eKloFaJuC.png', 1)
        ON CONFLICT DO NOTHING;
      `;

      await pool.query(insertGamesSQL);
      console.log("Games data inserted");

      console.log("Database seeded successfully");
    } else {
      console.log("Database already contains data, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

module.exports = seedDatabase;
