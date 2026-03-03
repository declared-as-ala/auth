const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const config = require('./config/env');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const app = express();

// Connect to database then start server
connectDB()
  .then(() => {
    // Middlewares
    if (config.env !== 'test') {
      app.use(morgan('dev'));
    }

    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Health check
    app.get('/health', (req, res) => {
      res.status(200).json({ success: true, message: 'OK' });
    });

    // Routes
    app.use('/api/auth', authRoutes);

    // 404 handler
    app.all('*', notFoundHandler);

    // Central error handler
    app.use(errorHandler);

    app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running in ${config.env} mode on port ${config.port}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', err);
    process.exit(1);
  });

module.exports = app;

