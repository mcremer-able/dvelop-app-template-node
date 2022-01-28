const express = require('express');
const dvelop = require('@dvelop-sdk/express-utils');

module.exports = function (assetBasePath) {
  const router = express.Router();

  router.use(dvelop.authenticationMiddleware); // This page requires a logged in user.

  router.get('/', function (req, res, next) {
    res.format({
      'text/html': function () {
        res.render('idpdemo', {
          title: 'Idp Demo',
          stylesheet: `${assetBasePath}/idpdemo.css`,
          UserId: req.dvelopContext.user.id,
          UserName: req.dvelopContext.user.displayName
        });
      },
      'default': function () {
        res.status(406).send('Not Acceptable')
      }
    });
  });
  return router;
};

