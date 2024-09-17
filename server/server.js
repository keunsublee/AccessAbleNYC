require('dotenv').config(); // Load environment variables from .env file
const express = require("express");
const cors = require('cors');
const app = express();
const { Sequelize, DataTypes } = require('@sequelize/core');
const { PostgresDialect } = require('@sequelize/postgres');

app.use(cors());

// Set up Sequelize using the render DATABASE_URL stored in  .env
const sequelize = new Sequelize({
    dialect: PostgresDialect,
    url: process.env.DATABASE_URL, // Use the DATABASE_URL from .env
    ssl: true,
    clientMinMessages: 'notice',
});
  
// Database connection tester
sequelize.authenticate()
  .then(() => console.log('Database connected successfully...'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Db simple model definition
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false }, 
    email: { type: DataTypes.STRING, allowNull: false, unique: true }, 
});
  
// Sync the database (create tables)
sequelize.sync({ force: true });

// API Route for Hello World message
app.get("/api/home", (req, res) => {
    res.json({ message: "Hello World!" });
});
  
// API Route to fetch users from the database
app.get('/api/users', async (req, res) => {
    try {
         // Fetch all users from the database
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
});
  
// Server Starter
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
