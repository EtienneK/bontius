const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');

const interactionRouter = require('./routes/interaction');
const oidcProvider = require('./providers/oidc.provider');
const app = express();

/*
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('[app] mongodb connection error - is it running?');
  process.exit();
});

/*
 * Express configuration.
 */
app.use(helmet());

/*
 * Express routes.
 */
app.use('/interaction', interactionRouter);
app.use(oidcProvider.callback);

module.exports = app;