const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');

const setupMiddleware = app => {
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
};

module.exports = setupMiddleware;
