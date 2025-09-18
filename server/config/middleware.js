const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const helmetMiddleware = require('./helmet');
const corsMiddleware = require('./cors');
const tenantResolver = require('../middleware/tenant');

const setupMiddleware = app => {
  // Security headers and CORS should be first
  app.use(helmetMiddleware);
  app.use(corsMiddleware);

  // Body parsing middleware
  app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );
  app.use(bodyParser.json());

  // Cookie parsing middleware
  app.use(cookieParser());

  // Static files
  app.use('/public', express.static('public'));

  // Tenant resolution (must run before routes)
  app.use(tenantResolver);
};

module.exports = setupMiddleware;
