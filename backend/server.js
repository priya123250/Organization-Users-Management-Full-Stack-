const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const organizationRoutes = require('./routes/organizations');
const userRoutes = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'B2B Organizations Management API',
    version: '1.0.0',
    endpoints: {
      organizations: '/api/organizations',
      users: '/api/users'
    }
  });
});

app.use('/api/organizations', organizationRoutes);
app.use('/api/users', userRoutes);

// Error handler middleware
app.use(errorHandler);

// Sync database and start server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync models (use { force: false } in production)
    await sequelize.sync({ alter: false }); // Don't try to alter existing tables
    console.log('✅ Database models synced');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API Documentation: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
