const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logRoutes = require('./routes/logRoutes');
const sequelize = require('./models/sequelize');
const authRoutes = require('./routes/authRoutes')


const app = express();
app.use(cors());
app.use(express.json()); // ✅ Parses JSON requests

app.use('/api', authRoutes)
app.use('/api/logs', logRoutes);

// Connect and sync DB
sequelize.sync({ force: true }) // ✅ Use `force: true` to reset tables (dev only)
  .then(() => {
    console.log('Database synced ✅');
    app.listen(3001, async () => {
      console.log('Server running on http://localhost:3001 🚀');
    });
  })
  .catch((err) => {
    console.error('Failed to sync DB ❌', err);
  });
