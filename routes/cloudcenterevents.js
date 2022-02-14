const express = require('express');

module.exports = function () {

  const router = express.Router();

  router.post('/', function (req, res) {
    switch (req.body.type) {
      case "subscribe":
        console.log(`Tenant "${req.body.baseUri}" (${req.body.tenantId}) just subscribed :)`);
        break;

      case "resubscribe":
        console.log(`Tenant "${req.body.baseUri}" (${req.body.tenantId}) just resubscribed :)`);
        break;

      case "unsubscribe":
        console.log(`Tenant "${req.body.baseUri}" (${req.body.tenantId}) just unsubscribed :(`);
        break;

      case "purge":
        console.log(`Data for Tenant "${req.body.baseUri}" (${req.body.tenantId}) should be deleted!`);
        break;

      default:
        res.status(400).send('Bad Input');
        break;
    }

    res.sendStatus(200);
  });
  return router;
};