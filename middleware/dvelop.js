const appRouter = require("@dvelop-sdk/app-router");
const idp = require("@dvelop-sdk/identityprovider");

function setContext(req, res, next) {
    req.systemBaseUri = req.get(appRouter.DVELOP_SYSTEM_BASE_URI_HEADER) || process.env.systemBaseUri;
    req.tenantId = req.get(appRouter.DVELOP_TENANT_ID_HEADER) || 0;
    req.requestId = req.get(appRouter.DVELOP_REQUEST_ID_HEADER) || appRouter.generateRequestId();
    const requestSignature = req.get(appRouter.DVELOP_REQUEST_SIGNATURE_HEADER);

    // ATTENTION: The RequestSignature should always be validated. Invalid RequestSiganuters might be a security risk.
    const validRequest = appRouter.validateRequestSignature(process.env.SIGNATURE_SECRET, req.systemBaseUri, req.tenantId, requestSignature);

    if (validRequest) {
        next();
    } else {
        res.status(401).send("Forbidden");
    }
}

async function authenticate(req, res, next) {

    try {
        const authSessionId = getAuthSessionId(req);
        const principal = await idp.validateAuthSessionId(req.systemBaseUri, authSessionId);
        req.principal = principal;
        next();
    } catch (e) {
        console.error(e);
        rejectRequest(req, res);
    }
}

function getAuthSessionId(req) {
    const authorizationHeader = req.get("Authorization");
    const bearerTokenRegex = RegExp('^bearer (.*)$', "i"); // cf. https://regex101.com/
    const matches = bearerTokenRegex.exec(authorizationHeader);
    if (matches !== null) {
        return matches[1];
    }
    if (req.cookies["AuthSessionId"]) {
        return req.cookies["AuthSessionId"];
    }
    throw "No AuthSessionId found in request"
}

function rejectRequest(req, res) {
    if (req.get('Content-Type') === 'text/html') {
        const redirectUri = idp.getLoginRedirectionUri(res.originalUrl);
        res.redirect(redirectUri);
    } else {
        res.status(401).send("Unauthorized");
    }
}

module.exports = { setContext, authenticate }