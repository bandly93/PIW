const express = require('express');
const cors = require('cors');
const logRoutes = require('./routes/logRoutes');
const sequelize = require('./models/sequelize');
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express();
app.use(cors());
app.use(express.json()); // ✅ Parses JSON requests

app.use('/api', authRoutes)
app.use('/api/logs', logRoutes);
app.use('/api/user', userRoutes)

// Connect and sync DB
sequelize.sync({ 
  alter: true,
  logging: false
}) // ✅ Use `force: true` to reset tables (dev only)
  .then(() => {
    console.log('Database synced ✅');
    app.listen(3001, async () => {
      console.log('Server running on http://localhost:3001 🚀');
    });
  })
  .catch((err) => {
    console.error('Failed to sync DB ❌', err);
  });
