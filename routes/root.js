const express = require('express');

module.exports = function (assetBasePath, basePath, version) {
    const router = express.Router();

    // ATTENTION: This page does not use the authenticate middleware meaning its publicly available

    router.get('/', function (req, res, next) {
        console.log('TenantId:' + req.tenantId);
        console.log('SystemBaseUri:' + req.systemBaseUri);
        res.format({
            'text/html': function () {
                res.render('root', {
                    title: 'Root of your app',
                    stylesheet: `${assetBasePath}/root.css`,
                    version: version
                });
            },
            'application/hal+json': function () {
                res.send(
                    {
                        _links: {
                            featuresdescription: {
                                href: `${basePath}/features`
                            }
                        }
                    }
                )
            },
            'default': function () {
                res.status(406).send('Not Acceptable')
            }
        });
    });
    return router;
};

