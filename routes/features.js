const express = require('express');

module.exports = function (assetBasePath, basePath) {
    const router = express.Router();

    // ATTENTION: This page does not use the authenticate middleware meaning its publicly available

    router.get('/', function (req, res, next) {
        res.format({
            'application/hal+json': function () {
                res.send(
                    {
                        features: [
                            {
                                Url: `${basePath}/vacationrequest/`,
                                Title: 'Vacation management',
                                Subtitle: 'Manage vacation requests',
                                IconURI: `${assetBasePath}/feature_icon.svg`,
                                Summary: 'Your vacation requests and the requests of your employees',
                                Description: 'Apply for vacation and approve the vacation requests of your employees',
                                Color: '#adff2f',

                            }
                        ]
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
