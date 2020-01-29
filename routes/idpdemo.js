const express = require('express');
const authenticate = require('../modules/idp')();

module.exports = function (assetBasePath, basePath, version) {
    const router = express.Router();

    router.use(authenticate);

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

