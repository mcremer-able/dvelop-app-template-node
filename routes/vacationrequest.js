const express = require('express');

module.exports = function (assetBasePath) {
    const router = express.Router();

    router.get('/', function (req, res, next) {
        res.format({
            'text/html': function () {
                res.render('vacationrequests', {title: 'a', stylesheet: `${assetBasePath}/vacationrequests.css`, script: `${assetBasePath}/vacationrequests.js`});
            },

            'default': function () {
                res.status(406).send('Not Acceptable')
            }
        });
    });
    return router;
};

