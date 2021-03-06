const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');

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
app.use(compression());
app.use(helmet());
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public/css'),
    debug: true,
    outputStyle: 'compressed',
    prefix: '/css'
  })
);

app.use('/css/vendor/nprogress.css', express.static(__dirname + '/node_modules/nprogress/nprogress.css'));
app.use('/js/vendor/nprogress.js', express.static(__dirname + '/node_modules/nprogress/nprogress.js'));
app.use('/js/vendor/react.js', express.static(__dirname + '/node_modules/react/umd/react.production.min.js'));
app.use('/js/vendor/react-dom.js', express.static(__dirname + '/node_modules/react-dom/umd/react-dom.production.min.js'));
app.use('/js/vendor/react-jsonschema-form.js', express.static(__dirname + '/node_modules/react-jsonschema-form/dist/react-jsonschema-form.js'));
app.use(express.static(__dirname + '/public'));

/*
 * Express routes.
 */
app.use('/interaction', interactionRouter);
app.use(oidcProvider.callback);

module.exports = app;
