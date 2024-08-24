const { Sequelize } = require('sequelize');
const { MYSQL_HOST, MYSQL_PORT, MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_DB_NAME } = process.env;

const sequelize = new Sequelize(MYSQL_DB_NAME, MYSQL_USERNAME, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  dialect: 'mysql',
});

async function connectToMySQL() {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL');
  } catch (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
}

connectToMySQL();

module.exports = sequelize;