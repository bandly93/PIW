const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL);

fs.readdirSync(__dirname)
  .filter((file) =>
    file !== basename &&
    file.endsWith('.js') &&
    !file.startsWith('.') &&
    file !== 'index.js' &&
    file !== 'sequelize.js'  // 👈 Add this line
  )
  .forEach((file) => {
    console.log('Loading model:', file);
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
