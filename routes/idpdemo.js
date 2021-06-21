const express = require('express');
const dvelop = require('../middleware/dvelop')

module.exports = function (assetBasePath) {
    const router = express.Router();

    router.use(dvelop.authenticate);

    router.get('/', function (req, res, next) {
        res.format({
            'text/html': function () {
                res.render('idpdemo', {
                    title: 'Idp Demo',
                    stylesheet: `${assetBasePath}/idpdemo.css`,
                    UserId:req.principal.id,
                    UserName:req.principal.displayName,
                });
            },
            'default': function () {
                res.status(406).send('Not Acceptable')
            }
        });
    });
    return router;
};

