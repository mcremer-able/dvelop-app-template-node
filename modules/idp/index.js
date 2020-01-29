'use strict';

module.exports = authenticate;
const request = require('request');
const url = require('url');

const redirectionBase = "/identityprovider/login?redirect=";
const validateEndpoint = "/identityprovider/validate?allowExternalValidation=false";

function authenticate(allowExternalValidation) {
    return function requestId(req, res, next) {
        const authSessionID = authSessionIdFromRequest(req);
        if (!authSessionID) {
            console.log("no AuthsessionID");
            res.format({
                'text/html': function () {
                    res.redirect(redirectionBase + encodeURIComponent(req.originalUrl))
                },
                'default': function () {
                    res.set('WWW-Authenticate', 'Bearer');
                    res.sendStatus(401) // Unauthorized
                }
            });
            return;
        }
        if (!req.systemBaseUri) {
            throw new Error(`Request contains no SystemBaseUri`);
        }
        if (!req.tenantId) {
            throw new Error(`Request contains no TenantId`);
        }

        // todo use principal cache
        const absValidateEndpoint = url.resolve(req.systemBaseUri, validateEndpoint);
        request(absValidateEndpoint, {
            json: true,
            headers: {'Authorization': 'Bearer ' + authSessionID}
        }, (err, valRes, body) => {
            if (err) {
                throw err;
            }
            if (valRes && valRes.statusCode === 200) {
                // external Validation not supported yet
                // if (principal.isExternal && !allowExternalValidation) {
                //     console.log("external user tries to access a resource and doesn't have sufficient rights.");
                //     res.sendStatus(403);
                //     return;
                // }
                req.authSessionId = authSessionID;
                req.principal = body;
                next();
                return;
            }
            if (valRes && valRes.statusCode === 401) {
                console.log(`Unauthorized. Identityprovider ${absValidateEndpoint} returned HTTP-Statuscode ${valRes.statusCode} and message ${valRes.body}`);
                res.format({
                    'text/html': function () {
                        res.redirect(redirectionBase + encodeURIComponent(req.originalUrl))
                    },
                    'default': function () {
                        res.set('WWW-Authenticate', 'Bearer');
                        res.sendStatus(401) // Unauthorized
                    }
                });
                return;
            }
            console.log(`unexpected error. Identityprovider ${absValidateEndpoint} returned HTTP-Statuscode ${valRes.statusCode} and message ${valRes.body}`);
        });
    }
}

function authSessionIdFromRequest(req) {
    const authorizationHeader = req.get("Authorization");
    const bearerTokenRegex = RegExp('^bearer (.*)$', "i"); // cf. https://regex101.com/
    const matches = bearerTokenRegex.exec(authorizationHeader);
    if (matches !== null) {
        return matches[1];
    }
    if (req.cookies["AuthSessionId"]) {
        return req.cookies["AuthSessionId"];
    }
    console.log("no AuthSessionId found because there is no bearer authorization header and no AuthSessionId Cookie");
    return null
}
