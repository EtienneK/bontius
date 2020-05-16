const express = require('express');
const interactionRouter = require('./routes/interaction');
const oidcProvider = require('./providers/oidc.provider');
const app = express();

app.use('/interaction', interactionRouter);
app.use(oidcProvider.callback);

module.exports = app;