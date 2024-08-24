const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Connect to MySQL database using Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  })
  .catch((err) => {
    console.error('Error connecting to database:', err);
    process.exit(1);
  });

app.use(express.json());
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});